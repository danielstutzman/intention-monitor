require 'eventmachine'
require 'sinatra/base'
require 'thin'
require 'dotenv'
require 'em-http-request'
require 'json'
require 'em-ssh'
require 'uri'

Dotenv.load! '.env.apis'

class HelloApp < Sinatra::Base
  configure do
    set :threaded, false # true will queue requests to background thread
    set :connections, [] # variable to store stream connections
  end

  get '/' do
    'Hello World'
  end

  get '/stream', provides: 'text/event-stream' do
    stream :keep_open do |out|
      out << "event: update_monitoring_stats\ndata: this\n\n"
      settings.connections << out
      out.callback { settings.connections.delete(out) }
    end
  end
end

def emit_event(app, event_name, data)
  print 'Emitting event...'
  app.settings.connections.each do |out|
    out << "event: #{event_name}\ndata: #{data}\n\n"
  end
  puts 'done.'
end

def post_events_to_influxdb(series_name, events, assume_new)
  already_posted_times = []
  if assume_new
    really_post_events_to_influxdb series_name, events
  else
    print 'Querying InfluxDB for existing timestamps...'
    url = 'http://localhost:8086/db/root/series?u=root&p=root&q=' +
      URI::encode("select * from #{series_name} limit #{events.size}")
    http = EventMachine::HttpRequest.new(url).get
    http.errback  do
      STDERR.puts "#{http.response_header.status} from #{http.req.uri}:"
      STDERR.puts http.response
    end
    http.callback do
      datas = JSON.parse(http.response)
      datas.each do |data|
        which_column_is_time = data['columns'].index('time')
        data['points'].each do |point|
          already_posted_times.push point[which_column_is_time]
        end
      end
      events.reject! do |event|
        already_posted_times.include?(event['time'])
      end
      puts 'done.'
      really_post_events_to_influxdb series_name, events
    end
  end
end

def really_post_events_to_influxdb(series_name, events)
  print 'Posting to InfluxDB...'
  url = 'http://localhost:8086/db/root/series?u=root&p=root'

  all_keys = {}
  events.each do |event|
    event.keys.each do |key|
      all_keys[key] = true
    end
  end

  json = [{
    name:    series_name,
    columns: all_keys.keys,
    points:  events.map { |event| event.values_at(*all_keys.keys) },
  }].to_json

  http = EventMachine::HttpRequest.new(url).post body: json
  http.errback  do
    STDERR.puts "#{http.response_header.status} from #{http.req.uri}:"
    STDERR.puts http.response
  end
  http.callback do
    puts 'done.'
    if http.response != ''
      STDERR.puts http.response
    end
  end
end

class NginxAccessLogEventProvider
  def initialize(ssh_args, hostname, tail_command)
    @ssh_args                   = ssh_args
    @hostname                   = hostname
    @tail_command               = tail_command
    @previous_timestamp         = nil
    @sequence_in_same_timestamp = nil
  end
  def run_with_callback
    EventMachine::Ssh.start(*@ssh_args) do |conn|
      conn.errback do |e|
        STDERR.puts "#{e} (#{e.class})"
      end
      conn.callback do |ssh|
        channel = ssh.open_channel do |ch|
          ch.exec @tail_command do |ch, success|
            #raise 'could not execute command' unless success
            ch.on_data do |c, data| # (output to stdout)
              events = data.split("\n").map do |line|
                line_to_event(line)
              end
              yield events.compact if events.size > 0
            end
            ch.on_extended_data do |c, type, data| # (output to stderr)
              $stderr.print data
            end
          end
        end
      end
    end
  end
  def line_to_event(line)
    if match = line.match(%r@(?<ip_address>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - - \[(?<timestamp>\d{2}\/[a-z]{3}\/\d{4}:\d{2}:\d{2}:\d{2} (\+|\-)\d{4})\] ((\"(?<method>[A-Z]+) )(?<path>[^ ]+) (http\/1\.[01]")) (?<status_code>\d{3}) (?<num_bytes>\d+) (["](?<referer>(\-)|(.+))["]) (["](?<useragent>.+)["])@i)
      seconds_since_epoch = Time.parse(match[:timestamp].sub(':', ' ')).to_i
      is_monitis = match[:useragent].include?('monitis')
      if @previous_timestamp.nil?
        # ignore this log line, since there could have been logs above it
        # within the same second, so we don't know what millisecond suffix
        # to give it.
        @previous_timestamp = match[:timestamp]
        nil
      elsif match[:timestamp] == @previous_timestamp
        if @sequence_in_same_timestamp.nil?
          # Can't increment it; shouldn't emit event
        else
          @sequence_in_same_timestamp += 1
        end
      else
        @previous_timestamp = match[:timestamp]
        @sequence_in_same_timestamp = 1
      end

      if @sequence_in_same_timestamp != nil
        milliseconds = seconds_since_epoch * 1000 + @sequence_in_same_timestamp
        {
          'time'        => milliseconds,
          'hostname'    => @hostname,
          'ip_address'  => match[:ip_address],
          'method'      => match[:method],
          'path'        => match[:path],
          'status_code' => match[:status_code],
          'num_bytes'   => match[:num_bytes],
          'is_monitis'  => is_monitis,
        }
      end
    else
      $stderr.puts "Doesn't match regex: #{line}"
      nil
    end
  end
end

EventMachine.run do
  app = HelloApp.new
  Rack::Server.start({
    app:    app,
    server: 'thin',
    Host:   '0.0.0.0',
    Port:   '8181',
    signals: false, # so Ctrl-C works
  })

  if false
  EventMachine.add_periodic_timer 5 do
    print 'Checking Papertrail...'
    token = ENV['PAPERTRAIL_TOKEN'] or raise "Need ENV[PAPERTRAIL_TOKEN]"
    headers = { 'X-Papertrail-Token' => token }
    url = 'https://papertrailapp.com/api/v1/accounts.json'
    http = EventMachine::HttpRequest.new(url).get head: headers
    http.errback  do
      STDERR.puts "#{http.response_header.status} from #{http.req.uri}:"
      STDERR.puts http.response
      emit_event app, 'papertrail_usage_percent', 'error'
    end
    http.callback do
      puts 'done.'
      begin
        response = JSON.parse(http.response)
        data = response['log_data_transfer_used_percent']
      rescue => e
        STDERR.puts e
        data = 'error'
      end

      emit_event app, 'papertrail_usage_percent', data

      print 'Posting to InfluxDB...'
      url = 'http://localhost:8086/db/root/series?u=root&p=root'
      json = [{
        name: 'papertrail_metrics',
        columns: ['paper_trail_usage_percent'],
        points: [[data]],
      }].to_json
      http = EventMachine::HttpRequest.new(url).post body: json
      http.errback  do
        STDERR.puts "#{http.response_header.status} from #{http.req.uri}:"
        STDERR.puts http.response
      end
      http.callback do
        puts 'done.'
      end
    end
  end
  end

  passphrase   = File.read('passphrase').strip
  ssh_args     = ['basicruby.danstutzman.com', 'root',
                  { passphrase: passphrase }]
  tail_command = 'docker exec 9bb32 tail -f /var/log/nginx/access.log'
  provider     = NginxAccessLogEventProvider.new(
                   ssh_args, 'basicruby', tail_command)
  is_first_time = true
  provider.run_with_callback do |events|
    post_events_to_influxdb 'nginx_access_logs', events, !is_first_time
    is_first_time = false
  end

end

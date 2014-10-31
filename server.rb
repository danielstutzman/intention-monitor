require 'eventmachine'
require 'sinatra/base'
require 'thin'
require 'dotenv'
require 'em-http-request'
require 'json'
require 'em-ssh'

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

  EventMachine::Ssh.start('basicruby.danstutzman.com', 'root',
                          passphrase: File.read('passphrase').strip) do |conn|
    conn.errback do |e|
      STDERR.puts "#{e} (#{e.class})"
    end
    conn.callback do |ssh|
      channel = ssh.open_channel do |ch|
        command = 'docker exec 9bb32 tail -f /var/log/nginx/access.log'
        ch.exec command do |ch, success|
          #raise 'could not execute command' unless success
          ch.on_data do |c, data| # (output to stdout)
            data.split("\n").each do |line|
              if match = line.match(%r@(?<ipaddress>\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}) - - \[(?<timestamp>\d{2}\/[a-z]{3}\/\d{4}:\d{2}:\d{2}:\d{2} (\+|\-)\d{4})\] ((\"(?<method>[A-Z]+) )(?<path>[^ ]+) (http\/1\.[01]")) (?<status>\d{3}) (?<bytes>\d+) (["](?<referer>(\-)|(.+))["]) (["](?<useragent>.+)["])@i)
                since_epoch = Time.parse(match[:timestamp].sub(':', ' ')).to_i
                $stdout.puts match[:ipaddress], since_epoch
                is_monitis = match[:useragent].include?('monitis')


      print 'Posting to InfluxDB...'
      url = 'http://localhost:8086/db/root/series?u=root&p=root&time_precision=s'
      json = [{
        name: 'nginx_access_logs',
        columns: %w[time       hostname     ip_address         method
                    path       status       bytes              is_monitis],
        points: [[since_epoch, 'basicruby', match[:ipaddress], match[:method],
                  match[:path], match[:status], match[:bytes], is_monitis]],
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


              else
                $stderr.puts "Doesn't match regex: #{line}"
              end
            end
          end
          ch.on_extended_data do |c, type, data| # (output to stderr)
            $stderr.print data
          end
        end
      end
    end
  end

end

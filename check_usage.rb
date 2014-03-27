#!/usr/bin/ruby
require 'rubygems'
require 'bundler'
Bundler.setup

require 'net/http'
require 'uri'
require 'time'

reported_timestamps = {}
first_time = true

while true
  whitelist = File.read('check_usage.whitelist.txt').split("\n")

  all_timestamps = {}
  uri = URI.parse('http://192.168.0.1/utilities_webactivitylog.html')
  response = Net::HTTP.get_response(uri)
  lines = response.body.split("\n")
  lines.each do |line|
    if match = line.match(%r[<td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td><td>([^<]*)</td></tr><tr align=center>])
      timestamp = DateTime.strptime "#{match[1]} #{match[2]}",
        '%m/%d/%Y %H:%M:%S %p'
      source_ip = match[3]
      requested_host = match[4]
      if whitelist.find { |entry| requested_host == entry } == nil
        all_timestamps[timestamp] = requested_host
      end
    end
  end

  new_timestamps = all_timestamps.keys - reported_timestamps.keys
  if new_timestamps.size > 0
    new_timestamps.each do |new_timestamp|
      STDERR.puts [new_timestamp, all_timestamps[new_timestamp]].join("\t")
      reported_timestamps[new_timestamp] = all_timestamps[new_timestamp]
    end
      
    if !first_time
      uri = URI.parse('http://localhost:9292/alert')
      response = Net::HTTP.post_form uri, {}
    end
    first_time = false
  end

  sleep 10
end

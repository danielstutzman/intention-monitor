#!/usr/bin/ruby
require 'open-uri'
require 'net/http'
require 'json'
require 'time'
require 'pp'
require 'dotenv'

Dotenv.load! ".env.apis"

def gmt_to_local(gmt)
  Time.parse(gmt).strftime('%Y-%m-%d %H:%M:%S')
end

puts 'Wait for web server to start...'
sleep 5

while true

puts 'Getting papertrail usage...'
token = ENV['PAPERTRAIL_TOKEN'] or raise "Need ENV[PAPERTRAIL_TOKEN]"
headers = { 'X-Papertrail-Token' => token }
json = open('https://papertrailapp.com/api/v1/accounts.json', headers).read
papertrail_hash = JSON.parse(json)
pp papertrail_hash

puts 'Getting New Relic...'
key = ENV['NEWRELIC_API_KEY'] or raise "Need ENV[NEWRELIC_API_KEY]"
headers = { 'X-Api-Key' => key }
url = 'https://api.newrelic.com/v2/applications.json'
json = open(url, headers).read
newrelic_hash = JSON.parse(json)#['application_instance']['application_summary']
newrelic_hash = newrelic_hash['applications'].find { |app|
  app['name'] == 'Basic Ruby' }
newrelic_hash['last_reported_at'] =
  gmt_to_local(newrelic_hash['last_reported_at'])
pp newrelic_hash

puts 'Getting New Relic 2...'
headers = { 'X-Api-Key' => key }
url = "https://api.newrelic.com/v2/servers.json"
json = open(url, headers).read
newrelic2_hash = JSON.parse(json)
newrelic2_hash['servers'].each do |server|
  server['last_reported_at'] = gmt_to_local(server['last_reported_at'])
end
pp newrelic2_hash

puts 'Posting to monitor...'
http = Net::HTTP.new('localhost', 9292)
path = '/update_monitoring_stats'
data = {
  papertrail: papertrail_hash,
  newrelic: newrelic_hash,
  newrelic2: newrelic2_hash
}
  
http.request_post path, JSON.generate(data) do |response|
  puts "#{response.code} #{response.read_body}"
end

sleep 60

end

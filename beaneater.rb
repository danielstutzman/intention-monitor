require 'rubygems'
require 'bundler'
Bundler.setup

require 'beaneater'
require 'json'

beanstalk = Beaneater::Pool.new(['localhost:11300'])

beanstalk.jobs.register('sleep') do |job|
  id, body = job.id.to_i, JSON.parse(job.body)
  STDERR.puts "Got job ##{id} with #{body}"
  if RUBY_PLATFORM =~ /linux/
    if body['sleep'] == true
      `xset dpms force off`
    elsif body['sleep'] == false
      `xset dpms force on`
    end
  end
end

STDERR.puts 'Listening for jobs...'
beanstalk.jobs.process!

require 'rubygems'
require 'bundler'
Bundler.setup

require 'logger'
require 'json'
require 'dotenv'
require 'sinatra'
require 'haml'
require 'sass'
require 'beaneater'

RACK_ENV = ENV['RACK_ENV'] || 'development'
Dotenv.load! ".env.#{RACK_ENV}"

module IntentionMonitor
  class SassHandler < Sinatra::Base
    set :views, File.dirname(__FILE__) + '/stylesheets'
    get '/stylesheets/*.css' do
      filename = params[:splat].first
      sass filename.to_sym
    end
  end

  class App < Sinatra::Application
    use SassHandler

    configure do
      disable :method_override
      set :sessions,
          httponly:     true,
          secure:       production?,
          expire_after: 60 * 60 * 24 * 365,
          secret:       ENV['SESSION_SECRET']
      set static: true
      # gotta set root or it'll be set wrong during automated tests
      set root: File.dirname(__FILE__)
      #set :public_folder, Proc.new { File.join(root, ENV['PUBLIC_DIR']) }
      set server: 'thin', connections: []
    end

    use Rack::Logger

    def initialize(*args)
      super(*args)
      @beanstalk = Beaneater::Pool.new(['localhost:11300'])
    end

    get '/' do
      haml :index
    end

    get '/blank' do
      haml :blank
    end

    post '/sleep/on' do
      @beanstalk.tubes['sleep'].put JSON.generate(sleep: true)
    end

    post '/sleep/off' do
      @beanstalk.tubes['sleep'].put JSON.generate(sleep: false)
    end

    get '/stream', provides: 'text/event-stream' do
      stream :keep_open do |out|
        settings.connections << out
        out.callback { settings.connections.delete(out) }
      end
    end

    post '/alert' do
      settings.connections.each { |out| out << "data: alert\n\n" }
      'ok'
    end
  end
end

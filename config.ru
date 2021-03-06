require './backend'

module Rack
  class DeflaterWithExclusions < Deflater
    def initialize(app, options = {})
      @app = app
      @exclude = options[:exclude]
    end

    def call(env)
      if @exclude && @exclude.call(env)
        @app.call(env)
      else
        super(env)
      end
    end
  end
end

use Rack::DeflaterWithExclusions,
  exclude: proc { |env| env['PATH_INFO'] == '/stream' }

run IntentionMonitor::App

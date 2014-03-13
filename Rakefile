def create_with_sh(command, path)
  begin
    sh "#{command} > #{path}"
  rescue
    sh "rm -f #{path}"
    raise
  end
end

file 'app/concat/vendor.js' => %w[
  bower_components/underscore/underscore.js
  bower_components/react/react.js
] do |task|
  mkdir_p 'app/concat'
  command = "cat #{task.prerequisites.join(' ')}"
  create_with_sh command, task.name
end

file 'app/concat/browserified.js' => Dir.glob('app/*.coffee') do |task|
  mkdir_p 'app/concat'
  dash_r_paths = task.prerequisites.map { |path|
    ['-r', "./#{path}"]
  }.flatten.join(' ')
  command = %W[
    node_modules/.bin/browserify
    -t coffeeify
    --insert-global-vars ''
    -d
    -r underscore -r react
    -u xmlhttprequest -u deferred
    #{dash_r_paths}
  ].join(' ')
  create_with_sh command, task.name
end

file 'app/concat' => %w[
  app/concat/vendor.js
  app/concat/browserified.js
]

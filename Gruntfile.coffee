module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-mocha'
  grunt.loadNpmTasks 'grunt-bower-task'

  grunt.initConfig
    coffeelint:
      app:
        files:
          src: ['Gruntfile.coffee', 'backbone.modal.coffee', 'test/**/*.coffee']
        options:
          max_line_length:
            level: 'warn'
          no_backticks:
            level: 'warn'
    jshint:
      manifest: ['*.json']
    coffee:
      assets:
        files:
          'backbone.modal.js': ['backbone.modal.coffee']
      test:
        files:
          'test/backbone.modal_spec.js': ['test/backbone.modal_spec.coffee']
    mocha:
      options:
        run: true
      test:
        src: ['test/test.html']
    watch:
      files: ['*.coffee', 'test/**/*.coffee']
      tasks: ['coffeelint', 'coffee', 'mocha']
    bower:
      install:
        targetDir: 'bower_components'
        copy: no

  grunt.registerTask 'default', ['bower', 'jshint', 'coffeelint', 'coffee', 'mocha']

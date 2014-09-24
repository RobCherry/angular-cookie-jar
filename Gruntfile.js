'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    'package': grunt.file.readJSON('package.json'),

    banners: {
      default: [
        '/**',
        ' * Angular Cookie Jar - <%= package.description %>',
        ' * @version <%= package.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
        ' * @link <%= package.homepage %>',
        ' * @author <%= package.author %>',
        ' * @copyright 2014',
        ' * @license MIT License, http://www.opensource.org/licenses/MIT',
        ' *',
        ' * Loosely based on jQuery Cookie plugin (https://github.com/carhartl/jquery-cookie)',
        ' * Copyright 2006, 2014 Klaus Hartl',
        ' */',
        ''
      ].join('\n'),
      min: '/*! <%= package.name %> v<%= package.version %> | Copyright 2014 <%= package.author %> | Released under the <%= package.license %> license */'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'src/**/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },

    concat: {
      options: {
        banner: '<%= banners.default %>'
      },
      build: {
        files: {
          'dist/angular-cookie-jar.js': 'src/angular-cookie-jar.js'
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= banners.min %>',
        sourceMap: true
      },
      build: {
        files: {
          'dist/angular-cookie-jar.min.js': 'dist/angular-cookie-jar.js'
        }
      }
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      build: {
        singleRun: true,
        autoWatch: false
      },
      debug: {
        singleRun: false,
        autoWatch: true
      },
      travis: {
        singleRun: true,
        autoWatch: false,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.registerTask('build', [
    'jshint',
    'karma:build',
    'concat',
    'uglify'
  ]);

  grunt.registerTask('test', function(target) {
    target = target || 'build';
    grunt.task.run('karma:' + target);
  });

  grunt.registerTask('default', [
    'build'
  ]);
};

'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    npm: grunt.file.readJSON('package.json'),
    bower: grunt.file.readJSON('.bowerrc'),

    paths: {
      src: 'src',
      example: 'example',
      test: 'test',
      dist: 'dist'
    },

    /* configuration */

    watch: {
      js: {
        files: ['<%= paths.src %>/{,*/}*.js'],
        tasks: ['jshint', 'test']
      },
      jstest: {
        files: ['<%= paths.test %>/{,*/}*.js'],
        tasks: ['test']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    connect: {
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            '<%= bower.directory %>',
            '<%= paths.test %>',
            '<%= paths.src %>'
          ]
        }
      },
      server: {
        options: {
          port: 9000,
          hostname: '0.0.0.0',
          open: false,
          base: [
            '.tmp',
            '<%= bower.directory %>',
            '<%= paths.test %>',
            '<%= paths.example %>',
            '<%= paths.src %>'
          ]
        }
      }
    },

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= paths.dist %>/*',
            '!<%= paths.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= paths.src %>/{,*/}*.js'
      ]
    },

    jasmine: {
      dist: {
        src: [
          '<%= paths.src %>/*.js'
        ],
        options: {
          helpers: '<%= paths.test %>/*.shim.js',
          specs: '<%= paths.test %>/*.spec.js'
        }
      }
    },

    uglify: {
      min: {
        options: {
          mangle: true,
          compress: true,
          preserveComments: 'some',
          sourceMap: true,
          banner: '/*! <%= npm.name %> - v<%= npm.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> by marmorkuchen.net */'
        },
        files: {
          '<%= paths.dist %>/osc.min.js': [ '.tmp/osc.dist.js' ]
        }
      },
      src: {
        options: {
          beautify: {
            width: 80,
            'indent_level': 2,
            beautify: true
          },
          mangle: false,
          compress: false,
          preserveComments: 'some',
          sourceMap: false,
          banner: '/*! <%= npm.name %> - v<%= npm.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> by marmorkuchen.net */\n'
        },
        files: {
          '<%= paths.dist %>/osc.js': [ '.tmp/osc.dist.js' ]
        }
      }
    },

    replace: {
      dist: {
        src: ['<%= paths.src %>/osc.js'],
        dest: '.tmp/osc.dist.js',
        replacements: [{
          from: /\/\/ START_SPECS([\S\s]*?)END_SPECS/g,
          to: ''
        }]
      }
    },

    bump: {
      options: {
        files: [ 'package.json', 'bower.json' ],
        commit: false,
        createTag: false,
        push: false
      }
    }

  });

  /* tasks */

  grunt.registerTask('serve', [
    'clean:server',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('test', [
    'connect:test',
    'jasmine'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'replace:dist',
    'uglify',
    'clean:server'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);
};

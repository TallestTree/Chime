module.exports = function(grunt) {
  // File-write plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exorcise');

  // Testing plugins
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Watch plugins
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-notify');

  // Grunt setup
  grunt.initConfig({
    // Transpiles jsx into js and allows for use of common js patterns
    browserify: {
      admin: {
        src: ['public/scripts/admin/*.jsx', 'public/scripts/shared/*.jsx'],
        dest: 'public/build/admin.js',
        options: {
          transform: ['reactify'],
          browserifyOptions: {
             debug: true
          }
        }
      },
      client: {
        src: ['public/scripts/client/*.jsx', 'public/scripts/shared/*.jsx'],
        dest: 'public/build/client.js',
        options: {
          transform: ['reactify'],
          browserifyOptions: {
             debug: true
          }
        }
      }
    },

    // WARNING: DO NOT PUT IMPORTANT FILES HERE
    // Empties the directory
    clean: {
      clean: ['public/build']
    },

    // Allows for watching for both transpiling and restarting node
    concurrent: {
      app: {
        tasks: ['watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    csslint: {
      target: {
        src: ['public/stylesheets/style.css']
      }
    },

    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'public/build/bundle.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/style.css']
        }
      }
    },

    // Extract internal source maps into external maps to use as input to uglify for chaining
    exorcise: {
      admin: {
        files: {
          'public/build/admin.js.map': ['public/build/admin.js'],
        }
      },
      client: {
        files: {
          'public/build/client.js.map': ['public/build/client.js']
        }
      }
    },

    jshint: {
      files: ['public/scripts/**/*.jsx', 'server/**/*.js']
    },

    mochaTest: {
      frontEnd: {
        src: ['test/client/**/*.js']
      },
      server: {
        src: ['test/server/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: './server/server.js'
      }
    },

    uglify: {
      admin: {
        options: {
          sourceMap: true,
          sourceMapIn: 'public/build/admin.js.map'
        },
        files: {
          'public/build/adminBundle.min.js': ['node_modules/jquery/dist/jquery.min.js', 'public/build/admin.js']
        },
      },
      client: {
        options: {
          sourceMap: true,
          sourceMapIn: 'public/build/client.js.map'
        },
        files: {
          'public/build/clientBundle.min.js': ['node_modules/jquery/dist/jquery.min.js', 'public/build/client.js']
        }
      }
    },

    // Watches for changes and reruns the parts that need updating
    watch: {
      admin: {
        files: ['public/scripts/admin/**/.jsx'],
        tasks: ['jshint', 'browserify:admin', 'exorcise:admin', 'uglify:admin', 'mochaTest:frontEnd']
      },
      client: {
        files: ['public/scripts/client/**/*.jsx'],
        tasks: ['jshint', 'browserify:client', 'exorcise:client', 'uglify:client', 'mochaTest:frontEnd']
      },
      shared: {
        files: ['public/scripts/shared/**/*.jsx'],
        tasks: ['jshint', 'browserify', 'exorcise', 'uglify', 'mochaTest:frontEnd']
      },
      css: {
        files: ['public/stylesheets/style.css'],
        tasks: ['csslint', 'cssmin']
      },
      server: {
        files: ['server/**/*'],
        tasks: ['jshint', 'mochaTest:server']
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'csslint', 'clean', 'browserify', 'exorcise', 'uglify', 'cssmin']);
  grunt.registerTask('test', ['build', 'mochaTest']);
  grunt.registerTask('serve', ['test', 'concurrent']);
};

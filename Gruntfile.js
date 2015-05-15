module.exports = function(grunt) {
  // Build plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
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
        src: ['public/scripts/admin/**/*.jsx', 'public/scripts/shared/**/*.jsx'],
        dest: 'public/build/admin.js',
        options: {
          transform: ['reactify'],
          browserifyOptions: {
             debug: true
          }
        }
      },
      client: {
        src: ['public/scripts/client/**/*.jsx', 'public/scripts/shared/**/*.jsx'],
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
    // Empties these directories
    clean: {
      build: ['public/build'],
      fonts: ['public/fonts']
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

    copy: {
      fonts: {
        expand: true,
        cwd: 'node_modules/bootstrap/fonts/',
        src: '*',
        dest: 'public/fonts/'
      }
    },

    csslint: {
      target: {
        src: ['public/stylesheets/**/*.css']
      }
    },

    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'public/build/admin-bundle.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/admin-style.css'],
          'public/build/client-bundle.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/client-style.css'],
          'public/build/bundle.min.css':['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/style.css'] // TODO: Delete this third file when migrations are complete
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
        src: ['tests/client/**/*.js'],
        options: {
          require: ['tests/client/compiler.js']
        }
      },
      server: {
        src: ['tests/server/**/*.js']
      }
    },

    nodemon: {
      dev: {
        options: {
          cwd: __dirname+'/server'
        },
        script: 'server.js'
      }
    },

    uglify: {
      admin: {
        options: {
          sourceMap: true,
          sourceMapIn: 'public/build/admin.js.map'
        },
        files: {
          'public/build/adminBundle.min.js': ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/build/admin.js']
        },
      },
      client: {
        options: {
          sourceMap: true,
          sourceMapIn: 'public/build/client.js.map'
        },
        files: {
          'public/build/clientBundle.min.js': ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/build/client.js']
        }
      }
    },

    // Watches for changes and reruns the parts that need updating
    watch: {
      admin: {
        files: ['public/scripts/admin/**/*.jsx'],
        tasks: ['jshint', 'browserify:admin', 'exorcise:admin', 'uglify:admin']
      },
      client: {
        files: ['public/scripts/client/**/*.jsx'],
        tasks: ['jshint', 'browserify:client', 'exorcise:client', 'uglify:client']
      },
      shared: {
        files: ['public/scripts/shared/**/*.jsx'],
        tasks: ['jshint', 'browserify', 'exorcise', 'uglify']
      },
      css: {
        files: ['public/stylesheets/**/*.css'],
        tasks: ['csslint', 'cssmin']
      },
      server: {
        files: ['server/**/*'],
        tasks: ['jshint']
      },
      tests: {
        files: ['tests/**/*'],
        tasks: ['jshint']
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'csslint', 'clean', 'copy', 'browserify', 'exorcise', 'uglify', 'cssmin']);
  grunt.registerTask('test', ['build', 'mochaTest']);
  grunt.registerTask('serve', ['build', 'concurrent']);
  grunt.registerTask('default', ['serve']);
};

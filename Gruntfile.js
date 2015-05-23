module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  // Grunt setup
  grunt.initConfig({
    // Transpiles jsx into js and allows for use of common js patterns
    browserify: {
      admin: {
        src: ['public/scripts/admin/**/*.jsx', 'public/scripts/shared/**/*.jsx'],
        dest: 'public/build/admin.js',
        options: {
          transform: ['reactify']
        }
      },
      client: {
        src: ['public/scripts/client/**/*.jsx', 'public/scripts/shared/**/*.jsx'],
        dest: 'public/build/client.js',
        options: {
          transform: ['reactify']
        }
      }
    },

    // WARNING: DO NOT PUT IMPORTANT FILES HERE
    // Empties this directory
    clean: {
      build: ['public/build']
    },

    concat: {
      options: {
        separator: ';\n'
      },
      adminProd: {
        src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/scripts/admin/jquery.backstretch.min.js', 'public/build/admin.min.js'],
        dest: 'public/build/adminBundle.js'
      },
      clientProd: {
        src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/build/client.min.js'],
        dest: 'public/build/clientBundle.js'
      },
      adminDev: {
        src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/scripts/admin/jquery.backstretch.min.js', 'public/build/admin.js'],
        dest: 'public/build/adminBundle.js'
      },
      clientDev: {
        src: ['node_modules/jquery/dist/jquery.min.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'public/build/client.js'],
        dest: 'public/build/clientBundle.js'
      }
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
      target: {
        files: {
          'public/build/admin-bundle.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/admin-style.css'],
          'public/build/client-bundle.min.css': ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'public/stylesheets/client-style.css']
        }
      }
    },

    // Change environmental variables for tests
    env: {
      test: {
        TEST: true,
        options: {
          add: {
            PORT: 55987
          }
        }
      }
    },

    jshint: {
      files: ['public/scripts/**/*.jsx', 'server/**/*.js', 'tests/**/*.js', 'tests/client/**/*.jsx']
    },

    mochaTest: {
      client: {
        src: ['tests/client/**/*.jsx'],
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
        files: {
          'public/build/admin.min.js': ['public/build/admin.js']
        },
      },
      client: {
        files: {
          'public/build/client.min.js': ['public/build/client.js']
        }
      }
    },

    // Watches for changes and reruns the parts that need updating
    watch: {
      admin: {
        files: ['public/scripts/admin/**/*.jsx'],
        tasks: ['newer:jshint', 'browserify:admin', 'concat:adminDev']
      },
      client: {
        files: ['public/scripts/client/**/*.jsx'],
        tasks: ['newer:jshint', 'browserify:client', 'concat:clientDev']
      },
      shared: {
        files: ['public/scripts/shared/**/*.jsx'],
        tasks: ['newer:jshint', 'browserify', 'concat:adminDev', 'concat:clientDev']
      },
      css: {
        files: ['public/stylesheets/**/*.css'],
        tasks: ['newer:csslint', 'cssmin']
      },
      server: {
        files: ['server/**/*.js'],
        tasks: ['newer:jshint']
      },
      tests: {
        files: ['tests/**/*.js', 'tests/**/*.jsx'],
        tasks: ['newer:jshint']
      }
    }
  });

  grunt.registerTask('test', ['env:test', 'mochaTest']);
  grunt.registerTask('build', function(arg) {
    arg = arg || 'dev';
    if (arg === 'prod') {
      grunt.task.run(['clean', 'jshint', 'csslint', 'copy', 'browserify', 'uglify', 'concat:adminProd', 'concat:clientProd', 'cssmin']);
    } else if (arg === 'dev') {
      // Skips uglify
      grunt.task.run(['newer:jshint', 'newer:csslint', 'newer:copy', 'newer:browserify', 'newer:concat:adminDev', 'newer:concat:clientDev', 'newer:cssmin']);
    }
  });
  grunt.registerTask('serve', function(arg) {
    arg = arg || 'dev';
    grunt.task.run(['build:'+arg, 'concurrent']);
  });
  grunt.registerTask('default', ['serve']);
};

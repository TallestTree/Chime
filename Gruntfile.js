module.exports = function(grunt) {

  // Testing plugins
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Utility plugins
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-notify');

  // Grunt setup
  grunt.initConfig({
    browserify: {
      admin: {
        src: ['public/scripts/admin/*.jsx'],
        dest: 'public/build/admin.js',
        options: {
          watch: false,
          transform: ['reactify']
        }
      },
      client: {
        src: ['public/scripts/client/*.jsx'],
        dest: 'public/build/client.js',
        options: {
          watch: false,
          transform: ['reactify']
        }
      },
      adminWatch: {
        src: ['public/scripts/admin/*.jsx'],
        dest: 'public/build/admin.js',
        options: {
          watch: true,
          keepAlive: true,
          transform: ['reactify']
        }
      },
      clientWatch: {
        src: ['public/scripts/client/*.jsx'],
        dest: 'public/build/client.js',
        options: {
          watch: true,
          keepAlive: true,
          transform: ['reactify']
        }
      }
    },

    concurrent: {
      app: {
        tasks: ['browserify:adminWatch', 'browserify:clientWatch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    jshint: {
      files: ['public/scripts/**/*.js', 'public/scripts/**/*.jsx', 'server/**/*.js']
    },

    mochaTest: {
      test: {
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: './server/server.js'
      }
    },

    // 'grunt watch' runs the watch function
    watch: {
      jshint: {
        files: ['public/**/*.js', 'server/**/*'],
        tasks: ['jshint', 'mochaTest']
      }
    }
  });

  grunt.registerTask('test', ['jshint', 'mochaTest']);
  grunt.registerTask('build', ['jshint', 'browserify:admin', 'browserify:client', 'mochaTest']);
  grunt.registerTask('serve', ['build', 'concurrent']);
};

module.exports = function(grunt) {

  // Testing plugins
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Utility plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-notify');

  // Grunt setup
  grunt.initConfig({
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
  grunt.registerTask('serve', ['jshint', 'mochaTest', 'nodemon']);
};

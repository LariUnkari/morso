module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        esversion:6
      },
      all: ['gruntfile.js', 'src/js/**/*.js']
    },
    copy: {
      main: {
        files: [
          { expand:true, cwd:'src', src:['**'], dest:'build/' },
          { expand:false, src:[
            'node_modules/pixi.js/browser/pixi.js',
            'node_modules/pixi.js/browser/pixi.js.map'
          ], dest:'build/lib/' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['jshint', 'copy']);

};

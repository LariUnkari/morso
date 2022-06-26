module.exports = function(grunt) {

  grunt.initConfig({
    clean: {
      contents: ['build/']
    },
    jshint: {
      options: {
        esversion:6
      },
      all: ['gruntfile.js', 'src/js/**/*.js']
    },
    copy: {
      main: {
        files: [
          { expand:true, cwd:'src/js', src:['**'], dest:'build/js' },
          { expand:true, cwd:'src/assets/exported', src:['**'], dest:'build/assets' },
          { expand:false, src:[
            'node_modules/pixi.js/browser/pixi.js',
            'node_modules/pixi.js/browser/pixi.js.map'
          ], dest:'build/lib/' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['clean', 'jshint', 'copy']);

};

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
          { expand:false, src:'src/index.html', dest:'build/index.html' },
          { expand:true, cwd:'src/js', src:['**'], dest:'build/js' },
          { expand:true, cwd:'src/css', src:['**'], dest:'build/css' },
          { expand:true, cwd:'src/assets/fonts', src:['**'], dest:'build/assets/fonts' },
          { expand:true, cwd:'src/assets/sprites/exported', src:['**'], dest:'build/assets/sprites' },
          { expand:true, cwd:'node_modules/gsap/', src:['*.js', 'utils/*'], dest:'build/lib/gsap' },
          { expand:true, cwd:'node_modules/events-es6', src:'events-es6.js', dest:'build/lib' },
          { expand:true, cwd:'node_modules/pixi.js/dist/browser', src:[
            'pixi.js', 'pixi.js.map' ], dest:'build/lib/pixi' },
          { expand:true, cwd:'node_modules/webfontloader/', src:[
            'webfontloader.js' ], dest:'build/lib/webfont' }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['clean', 'jshint', 'copy']);

};

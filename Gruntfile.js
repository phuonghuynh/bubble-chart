module.exports = function (grunt) {
  grunt.initConfig({
    connect: {
      server: {
        options: {
          port: 8080,
          base: ".",
          keepalive: true
        }
      }
    },

    watch: {
      scripts: {
        files: ["*.js", "*.json"],
        options: {
          livereload: true
        }
      },
      markup: {
        files: ["*.html"],
        options: {
          livereload: true
        }
      },
      stylesheets: {
        files: ["*.css"],
        options: {
          livereload: true
        }
      }
    },

    "bower-install-simple": {
      options: {
        color: true,
        directory: "bower_components"
      },
      prod: {
        options: {
          production: true
        }
      }
    },

    jsdoc2md: {
      main: {
        files: [
          {
            cwd: "src",
            expand: true,
            src: ["**/*.js"],
            dest: "api",
            ext: '.md'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-bower-install-simple");
  grunt.loadNpmTasks("grunt-jsdoc-to-markdown");
  grunt.loadNpmTasks("grunt-jsdox");

  // start a http server and serve at folder "test"
  grunt.registerTask("default", ["bower-install-simple", "connect", "watch"]);
  grunt.registerTask("export-api", ["jsdoc2md"]);
};
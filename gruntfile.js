module.exports = function(grunt) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  grunt.loadNpmTasks('grunt-mongo-migrations');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    migrations: {
      path: __dirname + '/migrations',
      template: grunt.file.read( __dirname + "/migrations/_template.js"),
      mongo: process.env.MONGOLAB_URI || 'mongodb://localhost/recycling_' + process.env.NODE_ENV,
      ext: 'js'
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: [
          'test/unit/**/*.js',
          'test/integration/**/*.js'
        ]
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['static/js/*.js'],
        dest: 'public/js/'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyy")%>*/\n'
      },
      dist: {
        files: {
          'public/js/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    watch: {
      options: { nospawn: true },
      js: {
        files: ['static/js/*.js'],
        tasks: ['compile']
      },
      css: {
        files: ['static/css/*.css'],
        tasks: ['compile']
      },
      tests: {
        files: ['test/**/*.js'],
        tasks: ['test']
      }
    }
  });

  grunt.registerTask('test',['mochaTest']);
  grunt.registerTask('compile', ['concat', 'uglify']);
};

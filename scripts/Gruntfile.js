module.exports = function(grunt){
	
	grunt.initConfig({
		concat: {
			js: {
				src: ['../src/**/*.js', 'tmp/templates.js'],
				dest: '../gae/static/app.debug.js'
			},
			scss: {
				src: ['../src/app.scss', '../src/**/*.scss'],
				dest: 'tmp/styles.scss'
			}
		},
		uglify: {
			js: {
				files: {
					'../gae/static/app.js': ['../gae/static/app.debug.js']
				}
			}
		},
		sass: {
			dist: {
				options:{
					style: 'compressed'
				},
				files: {
					'../gae/static/styles.css': 'tmp/styles.scss'
				}
			}
		},
		ngtemplates: {
			myapp: {
				cwd: '../src',
				src: '**/*.html',
				dest: 'tmp/templates.js',
				options: {
					htmlmin: { collapseWhitespace: true }
				}
			}
		},
		watch: {
			options: {
				atBegin: true
			},
			js: {
				files: ['../src/**/*.js', 'tmp/templates.js'],
				tasks: ['concat:js', 'uglify:js']
			},
			scss: {
				files: ['../src/**/*.scss'],
				tasks: ['concat:scss', 'sass:dist']
			},
			html: {
				files: ['../src/**/*.html'],
				tasks: ['ngtemplates:myapp']
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-angular-templates');
	
	grunt.registerTask('default', ['watch']);
	
};
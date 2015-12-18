module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                src: 'env.ini'
            },
            production: {
            }
        },

        bower: {
            install: {
                options: {
                    targetDir: './www/lib',
                    layout: 'byComponent'
                }
            }
        },

        browserify: {
            dev: {
                options: {
                    browserifyOptions: {
                        debug: true
                    },
                    transform: [
                        ['envify']
                    ]
                },
                files: {
                    'www/build/index-bundle.dev.js': [ 'www/src/index.js']
                }
            },
            production: {
                options: {
                    transform: [
                        ['envify']
                    ]
                },
                files: {
                    'www/build/index-bundle.js': [ 'www/src/index.js']
                }
            }
        },

        uglify: {
            production: {
                options: {
                    sourceMap: false
                },
                files: {
                    'www/build/index-bundle.min.js': ['www/build/index-bundle.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('build-dev', ['env:dev', 'bower:install', 'browserify:dev']);
    grunt.registerTask('build', ['env:production', 'bower:install', 'browserify:production', 'uglify:production']);
};
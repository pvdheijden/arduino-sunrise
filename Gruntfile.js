module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        env: {
            dev: {
                src: 'build-env.ini'
            },
            production: {
                src: 'build-env.ini'
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
                    'www/lib/index-bundle.dev.js': [ 'www/src/index.js']
                }
            },
            production: {
                options: {
                    transform: [
                        ['envify']
                    ]
                },
                files: {
                    'www/lib/index-bundle.js': [ 'www/src/index.js']
                }
            }
        },

        uglify: {
            production: {
                options: {
                    sourceMap: false
                },
                files: {
                    'www/lib/index-bundle.min.js': ['www/lib/index-bundle.js']
                }
            }
        },

        aws: grunt.file.readJSON("aws/credentials.json"),
        s3: {
            options: {
                accessKeyId: "<%= aws.accessKeyId %>",
                secretAccessKey: "<%= aws.secretAccessKey %>",
                region: 'eu-west-1',
                bucket: 'arduino-sunrise'
            },
            build: {
                cwd: "www/",
                src: "**"
            }
        }
    });

    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-aws');

    grunt.registerTask('build-dev', ['env:dev', 'bower:install', 'browserify:dev']);
    grunt.registerTask('build', ['env:production', 'bower:install', 'browserify:production', 'uglify:production']);

    grunt.registerTask('deploy-aws', ['env:production', 'bower:install', 'browserify:production', 'uglify:production', 's3']);
};
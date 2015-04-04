module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        'bower': {
            'install': {
                'options': {
                    'targetDir': './www/lib',
                    'layout': 'byComponent'
                }
            }
        },

        'copy': {
            'install': {
                'options': {
                },
                'files': [
                    {
                        'dest': './www/lib/bootstrap/bootstrap.css.map', 'src': './bower_components/bootstrap/dist/css/bootstrap.css.map'
                    },
                    {
                        'flatten': true, 'expand': true,
                        'dest': './www/lib/bootstrap/', 'src': ['./bower_components/bootstrap/dist/css/bootstrap-theme.css*']
                    }
                ]
            }
        },

        'react': {
            'www': {
                'files': {
                }
            }
        },

        'env': {
            'dev': {
                'src': 'env.ini'
            }
        },

        'jshint': {
            'lint': {
                'options': {
                    'jshintrc': '.jshintrc',
                    'reporter': require('jshint-stylish')
                },
                'src': [
                    '*.js',
                    'routes/**/*.js',
                    'bin/www',
                    'lib/**/*.js',
                    'test/**/*.js',
                    'www/*.js'
                ]
            }
        },

        'mocha_istanbul': {
            'coverage': {
                'src': 'test',
                'options': {
                    'print': 'detail',
                    'reporter': 'spec'
                }
            }
        },

        'execute': {
            'www': {
                'options': {
                    'args': []
                },
                'src': ['./bin/www']
            }
        }

    });

    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.loadNpmTasks('grunt-react');

    grunt.loadNpmTasks('grunt-env');

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-istanbul');
    grunt.registerTask('test', ['env:dev', 'copy', /*'react',*/ 'jshint', 'mocha_istanbul']);

    grunt.registerTask('setup', ['env:dev', 'bower:install', 'copy:install'/*, 'react'*/]);

    grunt.loadNpmTasks('grunt-execute');
    grunt.registerTask('www', ['env:dev', /*'react',*/ 'execute:www']);
};
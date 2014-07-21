module.exports = function(grunt) {

    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({

        jshint: {
            options: {
                node: true,
                browser: true,
                esnext: true,
                bitwise: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                indent: 4,
                latedef: true,
                newcap: true,
                noarg: true,
                regexp: true,
                undef: true,
                unused: true,
                trailing: true,
                smarttabs: true,
                globals: {
                    describe: true,
                    beforeEach: true,
                    it: true
                }
            },
            source: {
                src: [ '*.js', 'test/*.js', 'src/*.js' ]
            },
            grunt: {
                src: [ 'Gruntfile.js' ]
            }
        },

        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: [ 'test/*.js' ]
            }
        },

        execute: {
            example: {
                src: [ 'examples/simple.js' ],
                options: {
                    args: [ '/home/justin/Downloads/my-tracks-2014-7-14/Tuesday.kml' ]
                }
            }
        },

        watch: {
            options : {
                livereload: 7777
            },
            source: {
                files: [
                    'src/*.js',
                    'test/*.js',
                    'examples/*.js',
                    'Gruntfile.js'
                ],
                tasks: [
                    'jshint',
                    'mochaTest'
                    // 'execute'
                ]
            }
        },

    });

    //defaults
    grunt.registerTask( 'default', [ 'watch:source' ]);
};

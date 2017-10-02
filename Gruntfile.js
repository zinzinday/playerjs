module.exports = function (grunt) {
    grunt.initConfig({
        sass: {
            dist: {
                files: {
                    'videojs/src/css/video-js.css': 'videojs/src/scss/video-js.scss'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'videojs/dist/css/player.min.css': [
                        'videojs/src/css/video-js.css',
                        'videojs/src/css/videojs-upnext.css',
                        'videojs/src/css/videojs-thumbnails.css',
                        'videojs/src/css/videojs-resolution-switcher.css'
                    ]
                }
            }
        },
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['videojs/src/js/ie8/videojs-ie8.js', 'videojs/src/js/video.js', 'videojs/src/js/plugins/*.js'],
                dest: 'videojs/dist/js/player.js'
            }
        },
        copy: {
            main: {
                files: [
                    {src: 'videojs/src/js/video-js.swf', dest: 'videojs/dist/swf/video-js.swf'},
                    {src: 'videojs/src/js/videojs-contrib-hls.js', dest: 'videojs/dist/js/videojs-contrib-hls.js'}
                ]
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'videojs/dist/js/player.min.js': ['videojs/dist/js/player.js'],
                    'videojs/dist/js/videojs-contrib-hls.min.js': ['videojs/dist/js/videojs-contrib-hls.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('default', 'this is working', function () {
        console.log('ready run grunt');
    });
    grunt.registerTask('default', ['sass', 'cssmin', 'concat','copy', 'uglify']);

};
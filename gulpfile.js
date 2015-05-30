/* File: gulpfile.js */

var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});

gulp.task('develop', function () {
    nodemon({ script: 'server.js',
        ext: 'js' })
        .on('restart', function () {
            console.log('restarted!')
        })
});
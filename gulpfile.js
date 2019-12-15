/*jslint node: true, nomen: true */
"use strict";

var gulp = require('gulp'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    extractor = require('gulp-extract-sourcemap'),
    minifyjs = require('gulp-uglify');

gulp.task('clean', function () {
    return gulp.src('./dist/*', {read: false, dot: true}).pipe(rimraf({ force: true }));
});

var expose = {
    'window': 'window',
};

gulp.task('almost.js', function () {
    return browserify({
        entries: './global.js',
        debug: true,
    })
        .transform('exposify', {
            expose: expose
        })
        .bundle()
        .pipe(source('almost.js'))
        .pipe(buffer())
        .pipe(extractor({
            basedir: __dirname,
            fakeFix: true
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('almost.min.js', function () {
    return browserify({
        entries: './global.js',
        debug: false,
    })
        .transform('exposify', {
            expose: expose
        })
        .bundle()
        .pipe(source('almost.min.js'))
        .pipe(buffer())
        .pipe(minifyjs())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', gulp.parallel('almost.js', 'almost.min.js'));

gulp.task('default', gulp.series('clean', 'build'));

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var del = require('del');
var runSequence = require('run-sequence');

// Compile Sass for Test
gulp.task('sass', function () {
    return gulp.src(['app/scss/**/*.scss'])
        .pipe($.rubySass({
            compass: true,
            style: 'expanded'
        }))
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true, once: true}));
});

// Compile Sass for Production
gulp.task('sass:build', function () {
    return gulp.src(['app/scss/**/*.scss'])
        .pipe($.rubySass({
            compass: true,
            style: 'compressed'
        }))
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(gulp.dest('dist/css'))
});

// Start BrowserSync
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app"
        }
    });
});

// Copy Web Fonts To Dist
gulp.task('fonts', function () {
    return gulp.src(['app/fonts/**'])
        .pipe(gulp.dest('dist/fonts'));
});

// Copy Images To Dist
gulp.task('images', function () {
    return gulp.src(['app/images/**/*'])
        .pipe(gulp.dest('dist/images'));
});

// Copy All Files At The Root Level (app)
gulp.task('copy', function () {
    return gulp.src(['app/*','!app/*.html','!app/scss','!app/js'])
        .pipe(gulp.dest('dist'));
});

// Scan Your HTML For Assets & Optimize Them
gulp.task('html', function () {
    return gulp.src('app/**/*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest('dist'));
});

// Concat JS & Uglify Them
gulp.task('js', function () {
    return gulp.src(['app/js/**/*.js', ,'!app/js/script.js'])
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({stream: true, once: true}))
        .pipe($.uglify({preserveComments: 'some'}))
        .on('error', function (err) {
            console.log(err.message);
        })
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', del.bind(null, ['dist']));

// Serve, Default Task
gulp.task('default', ['sass', 'browser-sync'], function() {
    gulp.watch(['app/*.html'], browserSync.reload);
    gulp.watch(['app/scss/**/*.scss'], ['sass']);
    gulp.watch(['app/js/**/*.js'], ['js']);
});

// Build Production Files
gulp.task('build', ['clean'], function (cb) {
    runSequence('sass:build', ['js', 'html', 'images', 'fonts', 'copy'], cb);
});
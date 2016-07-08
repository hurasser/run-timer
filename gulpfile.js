var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var less = require('gulp-less');
var path = require('path');
var minifyCSS = require('gulp-minify-css');
var cssImport = require('gulp-cssimport');
var argv = require('yargs').argv;

gulp.task('js', function () {
  gulp.src(['src/main/js/app.js', 'src/main/js/**/*.js'])
    	.pipe(concat('app.js'))
    	.pipe(gulp.dest('src/main/webapp/js'))
});

gulp.task('js-min', function () {
	gulp.src(['src/main/js/app.js', 'src/main/js/**/*.js'])
		.pipe(concat('app.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/main/webapp/js'))
});

gulp.task('less', function () {
	gulp.src(['src/main/less/**/app.less', 'src/main/less/**/*.less'])
		.pipe(less())
		.pipe(cssImport())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('src/main/webapp/css'));
});

gulp.task('less-min', function () {
	gulp.src(['src/main/less/**/app.less', 'src/main/less/**/*.less'])
		.pipe(less())
		.pipe(cssImport())
		.pipe(minifyCSS())
		.pipe(concat('app.css'))
		.pipe(gulp.dest('src/main/webapp/css'));
});

gulp.task('watch', ['js', 'less'], function () {
	  gulp.watch('src/main/js/**/*.js', ['js']);
	  gulp.watch('src/main/less/**/*.less', ['less'])
});

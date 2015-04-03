var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');

var scripts = [
  '**/*.js',
  '!node_modules/**',
  '!spec/fixtures/**'
];

var specs = [
  'spec/**/*.js',
  '!spec/fixtures/**'
];

/**
 * lint
 */

gulp.task('lint', ['_jshint', '_jscs']);

gulp.task('_jshint', function() {
  return gulp.src(scripts)
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
});

gulp.task('_jscs', function() {
  return gulp.src(scripts).pipe(jscs());
});

/**
 * test
 */

gulp.task('test', function() {
  return gulp.src(specs).pipe(jasmine());
});

/**
 * default
 */

gulp.task('default', ['lint', 'test']);

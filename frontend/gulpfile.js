var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify')
var source = require('vinyl-source-stream');
var concatCss = require('gulp-concat-css');

var build = function () {
    return browserify({
      entries: './src/jsx/index.jsx',
      extensions: ['.jsx'],
      debug: true
    })
    .transform(babelify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('build/js'));
}

var cssfiles = [
  'src/css/**/*.css',
  'public/**/*.css'
]

var movecss = function () {
  return gulp.src(cssfiles)
            .pipe(concatCss("styles/bundle.css"))
            .pipe(gulp.dest('build'));
}

gulp.task('movecss', movecss);

gulp.task('build', ['movecss'], build);

gulp.task('watch', function () {
    gulp.watch('src/jsx/**/*.jsx', ['build']);
    gulp.watch(cssfiles, ['movecss']);
})

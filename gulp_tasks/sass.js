const autoprefixer = require('autoprefixer');
const config       = require('../frasco.config.js');
const gulp         = require('gulp');
const postcss      = require('gulp-postcss');
const sass         = require('gulp-sass');
const rename = require('gulp-rename');

gulp.task('sass', function () {
  return gulp.src(config.assets + '/' + config.sass.src + '/**/*')
    .pipe(sass({outputStyle: config.sass.outputStyle}).on('error', sass.logError))
    .pipe(postcss([
      autoprefixer({
        browsers: config.sass.autoprefixer.browsers
      })
    ]))
    .pipe(
      rename(function(file) {
        file.dirname = file.dirname.split('/')[0]
      })
    )
    .pipe(gulp.dest(config.assets + '/' + config.sass.dest));
});

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

var inject = require('gulp-inject');

//To watch for sass file injections
var wiredep = require('wiredep').stream;

// var useref = require('gulp-useref');

var browserSync = require('browser-sync').create();

gulp.task('sass', function(){

  var injectAppFiles = gulp.src('_src/_styles/scss/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('_src/_styles/main.scss')
    .pipe(wiredep())
    .pipe(autoprefixer())
    //return gulp.src('_src/_styles/scss/*.scss') //Globbing sass files
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(gulp.dest('_dist'))
    .pipe(browserSync.stream());
});

// gulp.task('useref', function(){
//   return gulp.src('app/*.html')
//     .pipe(useref())
//     .pipe(gulp.dest('dist'))
// });

gulp.task('html', ['sass'], function(){
  var injectFiles = gulp.src(['_dist/main.css']);

  //Remove the path to the css file, since theyre in the same folder
  var injectOptions = {
    addRootSlash: false,
    ignorePath: ['src', '']
  };

  return gulp.src('_src/index.html')
  .pipe(inject(injectFiles, injectOptions))
  .pipe(gulp.dest(''))
});

// Static Server + watching scss/html files
gulp.task('serve', ['html'], function() {

    browserSync.init({
        //proxy: "index.html"
        server: {
            baseDir: "./"
            // baseDir: "_dist"
        }
    });

    gulp.watch('_src/_styles/scss/*.scss', ['sass']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var inject = require('gulp-inject');

//To watch for sass file injections
var wiredep = require('wiredep').stream;

var browserSync = require('browser-sync').create();


var imagemin = require('gulp-imagemin'); //Optimize our images
var cache = require('gulp-cache'); //Cache optimzed images


gulp.task('sass', function(){

  var injectAppFiles = gulp.src('src/styles/scss/*.scss', {read: false});

  function transformFilepath(filepath) {
    return '@import "' + filepath + '";';
  }

  var injectAppOptions = {
    transform: transformFilepath,
    starttag: '// inject:app',
    endtag: '// endinject',
    addRootSlash: false
  };

  return gulp.src('src/styles/main.scss')
    .pipe(wiredep())
    .pipe(autoprefixer())
    //return gulp.src('src/styles/scss/*.scss') //Globbing sass files
    .pipe(inject(injectAppFiles, injectAppOptions))
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src'))
    .pipe(browserSync.stream());
});

gulp.task('icons', function() { 
    return gulp.src(config.bowerDir + '/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('src/fonts/')); 
});

gulp.task('images', function(){
  return gulp.src('src/imgs/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin()))
  .pipe(gulp.dest('src/imgs'))
});

// gulp.task('images', function() {
//   return gulp.src('src/imgs/*.+(png|jpg|gif|svg)')
// 	.pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 7, progressive: true, interlaced: true })))
// 	.pipe(gulp.dest('src/imgs'))
// 	.pipe(plugins.notify({ message: 'Images task complete' }));
// });
// gulp.task('js', function(){
//
// });

gulp.task('inject', ['sass'], function(){
  var sources = gulp.src(['src/main.css', 'src/main.js'], {read: false});
  var target = gulp.src('index.html');

  //Remove the path to the css file, since theyre in the same folder
  var injectOptions = {
    addRootSlash: false,
    // ignorePath: ['src', 'dist']
  };

  // return gulp.src('src/index.html')
  // .pipe(inject(sources, injectOptions))
  return target.pipe(inject(sources, injectOptions))
  // .pipe(inject(sources))
  .pipe(gulp.dest(''))
});

// Static Server + watching scss/html files
gulp.task('serve', ['inject'], function() {

    browserSync.init({
        //proxy: "index.html"
        server: {
            baseDir: "./"
            // baseDir: "dist"
        }
    });

    gulp.watch('src/styles/scss/*.scss', ['sass']);
    gulp.watch('src/js/main.js', ['js']);
    gulp.watch('index.html', ['inject']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['serve']);

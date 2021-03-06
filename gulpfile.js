const gulp = require('gulp')
const sass = require('gulp-sass')
const plumber = require('gulp-plumber')
const postcss = require('gulp-postcss')
const autoprefixer = require('autoprefixer')
const csso = require('gulp-csso')
const server = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const del = require('del')
const pug = require('gulp-pug')

gulp.task('css', function () {
  return gulp.src('src/sass/style.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(gulp.dest('dist/'))
    .pipe(server.stream())
})

gulp.task('html', function () {
  return gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
})

gulp.task('reload', function (done) {
  server.reload()
  done()
})

gulp.task('server', function () {
  server.init({
    server: 'dist/',
    notify: false,
    open: false,
    cors: true,
    ui: false
  })

  gulp.watch('src/sass/**/*.scss', gulp.series('css', 'reload'))
  gulp.watch('src/**/*.pug', gulp.series('html', 'reload'))
  gulp.watch('src/img/**.*', gulp.series('build', 'reload'))
})

gulp.task('copy', function () {
  return gulp.src([
      'src/fonts/**/*.{woff,woff2,eot,ttf,svg}',
      'src/img/**'
    ],
    {
      base: 'src'
    })
    .pipe(gulp.dest('dist'))
})

gulp.task('clean', function () {
  return del('dist')
})

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'css',
  'html'
))

gulp.task('start', gulp.series('build', 'server'))

gulp.task('imagemin', function () {
  return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest('src/img'))
})

gulp.task('webp', function () {
  return gulp.src('src/img/**/*.{png,jpg}')
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest('src/img'))
})

gulp.task('images', gulp.series([
  'imagemin',
  'webp'
]))

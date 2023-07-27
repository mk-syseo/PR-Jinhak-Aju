/**
 * A simple Gulp 4 Starter Kit for modern web development.
 *
 * @package @jr-cologne/create-gulp-starter-kit
 * @author JR Cologne <kontakt@jr-cologne.de>
 * @copyright 2020 JR Cologne
 * @license https://github.com/jr-cologne/gulp-starter-kit/blob/master/LICENSE MIT
 * @version v0.11.0-beta
 * @link https://github.com/jr-cologne/gulp-starter-kit GitHub Repository
 * @link https://www.npmjs.com/package/@jr-cologne/create-gulp-starter-kit npm package site
 *
 * ________________________________________________________________________________
 *
 * gulpfile.js
 *
 * The gulp configuration file.
 *
 */
const gulp                      = require('gulp'),
      fs                        = require('fs'),
      del                       = require('del'),
      sourcemaps                = require('gulp-sourcemaps'),
      plumber                   = require('gulp-plumber'),
      sass                      = require('gulp-dart-sass'),
      less                      = require('gulp-less'),
      stylus                    = require('gulp-stylus'),
      autoprefixer              = require('gulp-autoprefixer'),
      minifyCss                 = require('gulp-clean-css'),
      babel                     = require('gulp-babel'),
      webpack                   = require('webpack-stream'),
      uglify                    = require('gulp-uglify'),
      concat                    = require('gulp-concat'),
      imagemin                  = require('gulp-imagemin'),
      browserSync               = require('browser-sync').create(),
      ejs                       = require('gulp-ejs'),
      rename                    = require('gulp-rename'),
      dependents                = require('gulp-dependents'),
      ghPages                   = require('gulp-gh-pages'),
      src_folder                = './src/',
      src_assets_folder         = src_folder + 'assets/',
      dist_folder               = './dist/',
      dist_assets_folder        = dist_folder + 'assets/',
      node_modules_folder       = './node_modules/',
      dist_node_modules_folder  = dist_folder + 'node_modules/',
      node_dependencies         = Object.keys(require('./package.json').dependencies || {});

gulp.task('clear', () => del([ dist_folder ]));

gulp.task('html', () => {
  return gulp.src([ src_folder + '**/*.html' ], {
    base: src_folder,
    since: gulp.lastRun('html')
  })
    .pipe(gulp.dest(dist_folder))
    .pipe(browserSync.stream());
});

gulp.task('ejs', () => {
	return gulp.src(src_folder + 'ejs/**/!(_)*.ejs')
	.pipe(ejs({ title: 'gulp-ejs' }))
	.pipe(rename({ extname: '.html' }))
	.pipe(gulp.dest(dist_folder));
});

gulp.task('sass', () => {
  return gulp.src([
    src_assets_folder + 'sass/**/*.sass',
    src_assets_folder + 'scss/**/*.scss'
  ], { since: gulp.lastRun('sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist_assets_folder + 'css'))
    .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src(src_assets_folder + 'js/*.js', { since: gulp.lastRun('js') })
    .pipe(babel({
        presets: [ '@babel/env' ]
    }))
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(concat('bui.template.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist_assets_folder + 'js'))
    .pipe(browserSync.stream());
});

gulp.task('js-temp', () => {
	return gulp.src([ src_assets_folder + 'js/**/!(_)*.js' ], { since: gulp.lastRun('js') })
  // .pipe(sourcemaps.init())
	// .pipe(babel({
	// 	presets: [ '@babel/env' ]
	// }))
  // .pipe(concat('module.all.js'))
	// .pipe(uglify())
  // .pipe(sourcemaps.write('.'))
	.pipe(gulp.dest(dist_assets_folder + 'js'))
	.pipe(browserSync.stream());
});

gulp.task('json', () => {
	return gulp.src([ src_assets_folder + 'data/**/*.json' ], { since: gulp.lastRun('json') })
	.pipe(gulp.dest(dist_assets_folder + 'data'))
	.pipe(browserSync.stream());
});

gulp.task('images', () => {
  return gulp.src([ src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_assets_folder + 'images'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src([ src_assets_folder + 'fonts/**/*.+(eot|otf|svg|ttf|woff|woff2)' ], { since: gulp.lastRun('fonts') })
    .pipe(gulp.dest(dist_assets_folder + 'fonts'))
    .pipe(browserSync.stream());
});

gulp.task('vendor', () => {
  if (node_dependencies.length === 0) {
    return new Promise((resolve) => {
      console.log("No dependencies specified");
      resolve();
    });
  }

  return gulp.src(node_dependencies.map(dependency => node_modules_folder + dependency + '/**/*.*'), {
    base: node_modules_folder,
    since: gulp.lastRun('vendor')
  })
    .pipe(gulp.dest(dist_node_modules_folder))
    .pipe(browserSync.stream());
});

gulp.task('bui-sass', () => {
  return gulp.src([
    src_folder + 'assets_bui/sass/**/*.sass',
    src_folder + 'assets_bui/scss/**/*.scss',
  ], { since: gulp.lastRun('bui-sass') })
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(dependents())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist_folder + 'assets_bui/css'))
    .pipe(browserSync.stream());
});

gulp.task('bui-js', () => {
  return gulp.src(src_folder + 'assets_bui/js/*.js', { since: gulp.lastRun('bui-js') })
    .pipe(babel({
        presets: [ '@babel/env' ]
    }))
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(webpack({
      mode: 'production'
    }))
    .pipe(concat('bui.all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(dist_folder + 'assets_bui/js'))
    .pipe(browserSync.stream());
});

gulp.task('bui-images', () => {
  return gulp.src([ src_folder + 'assets_bui/images/**/*.+(png|jpg|jpeg|gif|svg|ico)' ], { since: gulp.lastRun('bui-images') })
    .pipe(plumber())
    .pipe(imagemin())
    .pipe(gulp.dest(dist_folder + 'assets_bui/images'))
    .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('clear', 'html', 'ejs', 'sass', 'js', 'json', 'images', 'fonts', 'vendor', 'bui-sass', 'bui-js', 'bui-images', 'bui-js'));
gulp.task('dev', gulp.series('html', 'ejs', 'sass', 'js', 'json', 'bui-sass', 'bui-js'));

gulp.task('serve', () => {
  return browserSync.init({
    server: {
      baseDir: [ 'dist' ]
    },
    port: 3000,
    open: false
  });
});

gulp.task('watch', () => {
  const watchImages = [
    src_assets_folder + 'images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
    src_folder + 'assets_bui/images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
  ];

  const watchVendor = [];

  node_dependencies.forEach(dependency => {
    watchVendor.push(node_modules_folder + dependency + '/**/*.*');
  });

  const watch = [
    src_folder + '**/*.html',
    src_folder + 'ejs/**/*.ejs',
    src_assets_folder + 'scss/**/*.scss',
    src_assets_folder + 'js/**/*.js',
    src_assets_folder + 'data/*.json',
    src_folder + 'assets_bui/scss/**/*.scss',
    src_folder + 'assets_bui/js/**/*.js',
  ];

  gulp.watch(watch, gulp.series('dev')).on('change', browserSync.reload);
  gulp.watch(watchImages, gulp.series('images')).on('change', browserSync.reload);
  gulp.watch(watchVendor, gulp.series('vendor')).on('change', browserSync.reload);
});

gulp.task('default', gulp.series('build', gulp.parallel('serve', 'watch')));

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

// console.log(gulp.src('./src/assets/data/navigation.json'));
require("babel-polyfill");

const gulp       = require('gulp');
const path       = require('path');
const sourcemaps = require('gulp-sourcemaps');
const webpack    = require('webpack-stream');
const mocha      = require('gulp-mocha');
const sass       = require('gulp-sass');

const directories = {
    src:  {
        js:  path.resolve(__dirname, 'resources/js',),
        css: path.resolve(__dirname, 'resources/stylesheets',)
    },
    test: {
        js: path.resolve(__dirname, 'tests',)
    },
    dist: {
        js:  path.resolve(__dirname, '../public/js',),
        css: path.resolve(__dirname, '../public/css',),
    }
};

///////////////////////////////////////////
const mochaTask     = () => gulp.src([directories.test.js + '/index.js'])
                                .pipe(mocha({
                                                reporter:  'spec',
                                                compilers: [
                                                    'js:babel-core/register',
                                                ]
                                            }));
const sassTask      = () => gulp.src(directories.src.css + '/scss/**/*.scss')
                                .pipe(sourcemaps.init())
                                .pipe(sass().on('error', sass.logError))
                                .pipe(sourcemaps.write())
                                .pipe(gulp.dest(directories.dist.css));
const webpackTask   = () => gulp.src(`${directories.src.js}/app/index.js`)
                                .pipe(webpack(require('./webpack.config.js')))
                                .on('error', error => console.log(error))
                                .pipe(gulp.dest(directories.dist.js + '/'))
                                .on('error', error => console.log(error));
const watchCSS_Task = () => gulp.watch(directories.src.css + '/scss/**/*.scss', ['sass']);
const watchJS_Task  = () => gulp.watch(directories.src.js + '/app/**/*.js', ['webpack']);

gulp.task('webpack', webpackTask);
gulp.task('sass', sassTask);
gulp.task('mocha', mochaTask);
gulp.task('watch:css', watchCSS_Task);
gulp.task('watch:js', watchJS_Task);

gulp.task('watch', () => [
    watchCSS_Task(),
    watchJS_Task()
]);
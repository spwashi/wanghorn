require("babel-polyfill");

const autoprefixer = require('gulp-autoprefixer');
const gulp         = require('gulp');
const path         = require('path');
const sourcemaps   = require('gulp-sourcemaps');
const webpack      = require('webpack-stream');
const mocha        = require('gulp-mocha');
const sass         = require('gulp-sass');

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

const _webpack_config  = {};
const getWebpackConfig = () => {
    _webpack_config.config = _webpack_config.config || require("./webpack.config.js");
    return _webpack_config.config;
};
///////////////////////////////////////////
const swallowError     = function (error) {
    console.log(error.toString());
    
    this.emit('end')
};
///////////////////////////////////////////
const mochaTask        = () => gulp.src([directories.test.js + '/index.js'])
                                   .pipe(mocha({
                                                   reporter:  'spec',
                                                   compilers: [
                                                       'js:babel-core/register',
                                                   ]
                                               }))
                                   .on('error', swallowError);
const sassTask         = () => gulp.src(directories.src.css + '/scss/**/*.scss')
                                   .pipe(sourcemaps.init())
                                   .pipe(sass().on('error', sass.logError))
                                   .pipe(sourcemaps.write())
                                   /*.pipe(autoprefixer({
                                                          browsers: ['last 2 versions'],
                                                          cascade:  false
                                                      }))*/
                                   .pipe(gulp.dest(directories.dist.css))
                                   .on('error', swallowError);
const webpackTask      = () => {
    const webpack_config = getWebpackConfig();
    return gulp.src(`${directories.src.js}/app/index.js`)
               .pipe(webpack(webpack_config))
               .on('error', swallowError)
               .pipe(gulp.dest(directories.dist.js + '/'))
               .on('error', swallowError);
};
const watchCSS_Task    = () => {
    sassTask();
    // console.log(require('./webpack.config.js'));
    return gulp.watch(directories.src.css + '/scss/**/*.scss', ['sass'])
};
const watchJS_Task     = () => {
    webpackTask();
    return gulp.watch(directories.src.js + '/app/**/*.js', ['webpack'])
};

gulp.task('webpack', webpackTask);
gulp.task('sass', sassTask);
gulp.task('mocha', mochaTask);
gulp.task('watch:css', watchCSS_Task);
gulp.task('watch:js', watchJS_Task);

gulp.task('watch', () => [
    watchCSS_Task(),
    watchJS_Task()
]);
import gulp from "gulp";
import path from "path";
import autoprefixer from "gulp-autoprefixer"
import sourcemaps from "gulp-sourcemaps";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import mocha from "gulp-mocha";
import sass from "gulp-sass";

const _app_path_  = path.resolve(__dirname, '..');
const _root_path_ = path.resolve(_app_path_, '..');
const directories = {
    src:  {
        js:  path.resolve(_app_path_, 'view/js',),
        css: path.resolve(_app_path_, 'view/stylesheets',)
    },
    test: {
        js: path.resolve(_app_path_, 'tests',)
    },
    dist: {
        js:  path.resolve(_root_path_, 'public/js',),
        css: path.resolve(_root_path_, 'public/css',),
    }
};

const _webpack_config  = {};
const getWebpackConfig = () => {
    _webpack_config.config = _webpack_config.config || require("./webpack.config.babel.js").default;
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
                                   .pipe(autoprefixer({
                                                          browsers: ['last 2 versions'],
                                                          cascade:  false
                                                      }))
                                   .pipe(gulp.dest(directories.dist.css))
                                   .on('error', swallowError);
const webpackTask      = () => {
    const webpack_config = getWebpackConfig();
    return gulp.src(`${directories.src.js}/index.js`)
               .pipe(webpackStream(webpack_config))
               .on('error', swallowError)
               .pipe(gulp.dest(directories.dist.js + '/'))
               .on('error', swallowError);
};
const watchCSS_Task    = () => {
    sassTask();
    // console.log(require('./webpack.config.js'));
    return gulp.watch([
                          directories.src.css + '/scss/**/*.scss',
                          directories.src.css + '/scss/**/**/*.scss',
                          directories.src.css + '/scss/**/**/**/*.scss',
                      ], ['sass'])
};
const watchJS_Task     = () => {
    webpackTask();
    return gulp.watch([
                          directories.src.js + '/**/*.js',
                          directories.src.js + '/**/**/*.js',
                          directories.src.js + '/**/**/**/*.js',
                      ], ['webpack'])
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
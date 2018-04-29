import gulp from "gulp";
import path from "path";
import sourcemaps from "gulp-sourcemaps";
import webpackStream from "webpack-stream";
import webpack from "webpack";
import mocha from "gulp-mocha";
import sass from "gulp-sass";
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import plumber from "gulp-plumber";
import {exec} from "child_process";

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
                                   .pipe(postcss([autoprefixer({add: process.env.NODE_ENV === 'production'})]))
                                   .pipe(sourcemaps.write())
                                   .pipe(gulp.dest(directories.dist.css))
                                   .on('error', swallowError);
const webpackTask      = () => {
    const webpack_config = getWebpackConfig();
    return gulp.src(`${directories.src.js}/index.js`)
               .pipe(plumber())
               .pipe(webpackStream(webpack_config))
               .pipe(gulp.dest(directories.dist.js + '/'))
               .on('end', args => exec('command -v beep && beep -l 40 -f 100'));
};
const watchCSS_Task    = () => {
    sassTask();
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
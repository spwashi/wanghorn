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
import {inputPath__config} from "./webpack.config.babel";

const _app_path_       = path.resolve(__dirname, '..');
const _root_path_      = path.resolve(_app_path_, '..');
const _webpack_config  = {};
const getWebpackConfig = () => {
    return _webpack_config.config = _webpack_config.config || require("./webpack.config.babel.js").default;
};
const directories      = {
    src:  {
        config: inputPath__config,
        js:     path.resolve(_app_path_, 'view/js',),
        css:    path.resolve(_app_path_, 'view/stylesheets',)
    },
    test: {
        js: path.resolve(_app_path_, 'tests',)
    },
    dist: {
        js:  path.resolve(_root_path_, 'public/js',),
        css: path.resolve(_root_path_, 'public/css',),
    }
};

///////////////////////////////////////////
const swallowError = function (error) {
    console.log(error.toString());
    
    this.emit('end')
};
function requireUncached(moduleName) {
    
    /**
     * Removes a module from the cache
     */
    function purgeCache(moduleName) {
        // Traverse the cache looking for the files
        // loaded by the specified module name
        searchCache(moduleName, function (mod) {
            delete require.cache[mod.id];
        });
        
        // Remove cached paths to the module.
        // Thanks to @bentael for pointing this out.
        Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
            if (cacheKey.indexOf(moduleName)>0) {
                delete module.constructor._pathCache[cacheKey];
            }
        });
    };
    
    /**
     * Traverses the cache to search for all the cached
     * files of the specified module name
     */
    function searchCache(moduleName, callback) {
        // Resolve the module identified by the specified name
        var mod = require.resolve(moduleName);
        
        // Check if the module has been resolved and found within
        // the cache
        if (mod && (typeof (mod = require.cache[mod]) !== "undefined")) {
            // Recursively go over the results
            (function traverse(mod) {
                // Go over each of the module's children and
                // traverse them
                mod.children.forEach(function (child) {
                    traverse(child);
                });
                
                // Call the specified callback providing the
                // found cached module
                callback(mod);
            }(mod));
        }
    }
    purgeCache(moduleName);
    return require(moduleName)
};
const beep            = (freq, len) => {
    let go = (freq = 100, len = 40) => exec(`command -v beep && beep -l ${parseInt(len)} -f ${parseInt(freq)}`);
    if (!freq && !len) return go();
    return () => go(freq, len);
};
///////////////////////////////////////////
const mochaTask       = () => gulp.src([directories.test.js + '/index.js'])
                                  .pipe(mocha({
                                                  reporter:  'spec',
                                                  compilers: [
                                                      'js:babel-core/register',
                                                  ]
                                              }))
                                  .on('error', swallowError);
const configTask      = () => {
    const configureApplication = requireUncached('./initialize/configure').default;
    configureApplication().then(beep(200)).then(webpackTask);
};
const sassTask        = () => gulp.src(directories.src.css + '/scss/**/*.scss')
                                  .pipe(sourcemaps.init())
                                  .pipe(sass().on('error', sass.logError))
                                  .pipe(postcss([autoprefixer({add: process.env.NODE_ENV === 'production'})]))
                                  .pipe(sourcemaps.write())
                                  .pipe(gulp.dest(directories.dist.css))
                                  .on('error', swallowError);
const webpackTask     = () => {
    const webpack_config = getWebpackConfig();
    return gulp.src(`${directories.src.js}/index.js`)
               .pipe(plumber())
               .pipe(webpackStream(webpack_config))
               .pipe(gulp.dest(directories.dist.js + '/'))
               .on('end', beep);
};
const watchConfigTask = () => {
    configTask();
    return gulp.watch([
                          directories.src.config + '/**/*.js',
                          directories.src.config + '/**/**/*.js',
                          directories.src.config + '/**/**/**/*.js',
                      ], ['config'])
};
const watchCSS_Task   = () => {
    sassTask();
    return gulp.watch([
                          directories.src.css + '/scss/**/*.scss',
                          directories.src.css + '/scss/**/**/*.scss',
                          directories.src.css + '/scss/**/**/**/*.scss',
                      ], ['sass'])
};
const watchJS_Task    = () => {
    webpackTask();
    return gulp.watch([
                          directories.src.js + '/**/*.js',
                          directories.src.js + '/**/**/*.js',
                          directories.src.js + '/**/**/**/*.js',
                      ], ['webpack'])
};

gulp.task('webpack', webpackTask);
gulp.task('sass', sassTask);

gulp.task('config', configTask);
gulp.task('mocha', mochaTask);
gulp.task('watch:config', watchConfigTask);
gulp.task('watch:css', watchCSS_Task);
gulp.task('watch:js', watchJS_Task);
gulp.task('watch', () => [
    watchCSS_Task(),
    watchJS_Task()
]);
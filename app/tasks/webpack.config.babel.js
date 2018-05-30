import {ENVIRONMENT} from "../config/config";
import {webpackPlugins} from "./webpack/plugins";
import {inputPath__CSS, outputJS_Filename, outputPath, outputPath__JS, publicURL__JS} from "./webpack/paths";
import {rules} from "./webpack/rules";

const IS_PROD = ENVIRONMENT === 'production';
export default {
    entry:     {'app': ['style.scss', '../view/js']},
    output:    {
        filename:   outputJS_Filename,
        publicPath: publicURL__JS,
        path:       outputPath__JS
    },
    devtool:   'source-map',
    devServer: {
        publicPath:         '/wanghorn',
        stats:              {
            colors:       true,
            all:          false,
            errors:       true,
            assets:       true,
            errorDetails: true
        },
        contentBase:        outputPath,
        proxy:              {
            '/wanghorn/public': {
                host:       'localhost',
                target:     'http://localhost:80',
                prependPah: false,
                logLevel:   'debug',
                onProxyRes(proxyRes, req, res) {
                    console.log(proxyRes);
                    return 'BOON';
                }
            },
            '/public':          {
                target:      'http://localhost:8080',
                prependPah:  false,
                logLevel:    'debug',
                pathRewrite: {'/': '/wanghorn/'}
            }
        },
        historyApiFallback: {
            index: 'html/wanghorn.html',
        }
    },
    resolve:   {
        modules:    [inputPath__CSS, 'node_modules'],
        extensions: [".js", ".json", ".scss", ".css"],
    },
    module:    {rules},
    plugins:   webpackPlugins
};
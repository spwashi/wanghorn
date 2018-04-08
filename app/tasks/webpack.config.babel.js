import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import path from "path";

import {APP_NAME, APP_PUBLIC_DIR, APP_URL, APP_VIEW_DIR, ENVIRONMENT} from "../config";

//++sm++ boilerplate
export const outputPath       = `${APP_PUBLIC_DIR}`;
export const outputPath__JS   = path.resolve(outputPath, 'js');
export const outputPath__HTML = path.resolve(outputPath, 'html');
export const inputPath__CSS   = path.resolve(APP_VIEW_DIR, 'stylesheets', 'scss');
//--sm-- boilerplate

const IS_PROD               = ENVIRONMENT === 'production';
const htmlTemplatePath      = path.resolve(__dirname, '../view/html/react.html');
const relativeCSS_output    = "../css/style.css";
export const indexHTML_name = `${APP_NAME}.html`;
const relativeHTML_output   = `../html/${indexHTML_name}`;
const publicPath__JS        = `${APP_URL}/public/js/`;
const outputFileName        = `${APP_NAME}.js`;

const plugins = [
    new ExtractTextPlugin({filename: relativeCSS_output}),
    new HtmlPlugin({
                       title:    APP_NAME,
                       template: htmlTemplatePath,
                       filename: relativeHTML_output
                   }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
];
if (IS_PROD) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}))
}

export default {
    entry:
               {
                   'app': [
                       'style.scss',
                       '../view/js'
                   ]
               },
    output:    {
        filename:   outputFileName,
        publicPath: publicPath__JS,
        path:       outputPath__JS
    },
    devtool:   !IS_PROD ? 'source-map' : false,
    resolve:   {
        modules:    [inputPath__CSS, 'node_modules'],
        extensions: [".js", ".json", ".scss", ".css"],
    },
    module:    {
        rules: [
            {
                test:    /\.scss$/,
                include: [inputPath__CSS],
                use:     ExtractTextPlugin.extract({
                                                       fallback: "style-loader",
                                                       use:      ["css-loader", {
                                                           loader:  "sass-loader",
                                                           options: {
                                                               sourceMap: !IS_PROD
                                                           }
                                                       }]
                                                   }),
            },
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                use:     [{
                    loader:  'babel-loader',
                    options: {
                        cacheDirectory: true,
                    }
                }],
            }
        
        ],
    },
    plugins
};
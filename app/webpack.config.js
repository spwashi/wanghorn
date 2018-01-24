import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import path from "path";

//++sm++ boilerplate
const APP_URL            = 'http://localhost/wanghorn/';
const APP_NAME           = "wanghorn";
const APP_PATH           = path.resolve(__dirname);
const APP_PUBLIC_PATH    = path.resolve(APP_PATH, '..', 'public');
const APP_RESOURCES_PATH = path.resolve(APP_PATH, 'resources');
//
const outputPath         = `${APP_PUBLIC_PATH}`;
const outputPath__JS     = path.resolve(outputPath, 'js');
const inputPath__CSS     = path.resolve(APP_RESOURCES_PATH, 'stylesheets', 'scss');
//#--sm-- boilerplate

module.exports = {
    entry:   [
        'style.scss',
        './resources/js/app'
    ],
    output:  {
        filename:   `${APP_NAME}.js`,
        publicPath: `${APP_URL}public/js/`,
        path:       outputPath__JS
    },
    devtool: 'source-map',
    resolve: {
        modules:    [inputPath__CSS, 'node_modules'],
        extensions: [".js", ".json", ".scss", ".css"],
    },
    module:  {
        rules: [
            {
                test:    /\.scss$/,
                include: [inputPath__CSS],
                use:     ExtractTextPlugin.extract({
                                                       fallback: "style-loader",
                                                       use:      ["css-loader", {
                                                           loader:  "sass-loader",
                                                           options: {
                                                               sourceMap: true
                                                           }
                                                       }]
                                                   }),
            },
            {
                test:    /\.js$/,
                exclude: /node_modules/,
                loader:  'babel-loader'
            }
        
        ],
    },
    plugins: [
        new ExtractTextPlugin("../css/style.css"),
        new HtmlPlugin({
                           title:    APP_NAME,
                           template: 'view/html/react.html',
                           filename: '../html/' + APP_NAME + '.html'
                       })
    ]
};
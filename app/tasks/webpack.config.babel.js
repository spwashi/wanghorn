import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import path from "path";
import CleanWebpackPlugin from "clean-webpack-plugin";
import {APP_NAME, APP_PATH__CONFIG_DIR, APP_PATH__PUBLIC_DIR, APP_PATH__VIEW_DIR, APP_URL, ENVIRONMENT} from "../config/config";

export const outputPath            = `${APP_PATH__PUBLIC_DIR}`;
export const outputPath__JS        = path.resolve(outputPath, 'js');
export const outputPath__HTML      = path.resolve(outputPath, 'html');
export const outputPath__CSS       = path.resolve(outputPath, 'css');
export const inputPath__CSS        = path.resolve(APP_PATH__VIEW_DIR, 'stylesheets', 'scss');
export const inputPath__config     = path.resolve(APP_PATH__CONFIG_DIR, 'pre');
const IS_PROD                      = ENVIRONMENT === 'production';
const htmlTemplatePath             = path.resolve(__dirname, '../view/html/react.html');
const relativeCSS_output_filename  = `../css/style${IS_PROD ? '-[hash:6]' : ''}.css`;
const publicURL__JS                = `${APP_URL}/public/js`;
const publicURL__HTML              = `${APP_URL}/public/html`;
const publicURL__IMG               = `${APP_URL}/public/img`;
const publicURL__CSS               = `${APP_URL}/public/css`;
const outputJS_Filename            = `${APP_NAME}-[hash:6].js`;
const indexHTML_name               = `${APP_NAME}.html`;
const relativeHTML_output_filename = `../html/${indexHTML_name}`;
const plugins                      = [new ExtractTextPlugin({filename: relativeCSS_output_filename}),
                                      new HtmlPlugin({
                                                         title:    APP_NAME,
                                                         template: htmlTemplatePath,
                                                         filename: relativeHTML_output_filename,
                                                         public:   {
                                                             publicURL__IMG,
                                                             publicURL__HTML,
                                                             publicURL__JS,
                                                         }
                                                     }),
                                      new CleanWebpackPlugin([`${outputPath__JS}/*`, `${outputPath__CSS}/*`],
                                                             {allowExternal: true}),
                                      new webpack.DefinePlugin({
                                                                   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                                                               })];
if (IS_PROD) plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}}));

export default {
    entry:
             {
                 'app': [
                     'style.scss',
                     '../view/js'
                 ]
             },
    output:  {
        filename:   outputJS_Filename,
        publicPath: publicURL__JS,
        path:       outputPath__JS
    },
    devtool: !IS_PROD ? 'source-map' : false,
    resolve: {
        modules:    [inputPath__CSS, 'node_modules'],
        extensions: [".js", ".json", ".scss", ".css"],
    },
    module:  {
        rules: [
            {
                test: /\.css$/,
                use:  [
                    "style-loader",
                    "css-loader",
                    {
                        loader:  "postcss-loader",
                        options: {
                            sourceMap:    !IS_PROD, path: './postcss.config.js',
                            autoprefixer: {
                                // add: IS_PROD
                            }
                        }
                    },
                ],
            },
            {
                test:    /\.scss$/,
                include: [inputPath__CSS],
                use:     ExtractTextPlugin.extract(
                    {
                        fallback: "style-loader",
                        use:      [
                            "css-loader",
                            {
                                loader:  "postcss-loader",
                                options: {
                                    sourceMap: !IS_PROD, path: './postcss.config.js',
                                    autoprefixer:              {
                                        // add: IS_PROD
                                    }
                                }
                            },
                            {loader: "sass-loader", options: {sourceMap: !IS_PROD}}
                        ]
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
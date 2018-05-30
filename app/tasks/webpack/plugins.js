import path from "path"
import ExtractTextPlugin from "extract-text-webpack-plugin";
import HtmlPlugin from "html-webpack-plugin";
import {APP_NAME, ENVIRONMENT} from "../../config/config";
import CleanWebpackPlugin from "clean-webpack-plugin";
import webpack from "webpack";
import {htmlTemplatePath, outputPath__CSS, outputPath__HTML, outputPath__JS, publicURL__HTML, publicURL__IMG, publicURL__JS, relativeCSS_output_filename, relativeHTML_output_filename} from "./paths";
import HtmlWebpackHarddiskPlugin from "html-webpack-harddisk-plugin";

const IS_PROD               = ENVIRONMENT === 'production';
const extractTextPlugin     =
          new ExtractTextPlugin({filename: relativeCSS_output_filename});
const htmlPlugin            =
          new HtmlPlugin({
                             title:             APP_NAME,
                             template:          htmlTemplatePath,
                             alwaysWriteToDisk: true,
                             inlineSource:      '.(js|css)$',
                             filename:          relativeHTML_output_filename,
                             public:            {
                                 publicURL__IMG,
                                 publicURL__HTML,
                                 publicURL__JS,
                             }
                         });
const cleanWebpackPlugin    =
          new CleanWebpackPlugin([
                                     `${outputPath__JS}/*`,
                                     `${outputPath__CSS}/*`
                                 ], {
                                     allowExternal: true
                                 });
const definePlugin          =
          new webpack.DefinePlugin({
                                       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
                                   });
const prodPlugins           =
          [
              new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
          ];
const devPlugins            =
          [
              new HtmlWebpackHarddiskPlugin({
                                                outputPath: path.resolve(outputPath__HTML)
                                            })
          ];
export const webpackPlugins = [
    extractTextPlugin,
    // Create an HTML file that will include the files we tryna
    htmlPlugin,
    // Remove the old CSS and JavaScript files
    cleanWebpackPlugin,
    // Define the environment
    definePlugin,
    
    ...(IS_PROD ? prodPlugins : devPlugins)
];
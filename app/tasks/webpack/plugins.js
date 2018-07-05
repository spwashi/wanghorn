import path                from "path"
import ExtractTextPlugin
                           from "extract-text-webpack-plugin";
import HtmlPlugin
                           from "html-webpack-plugin";
import {__CONFIGURATION__} from "../../config/config";
import CleanWebpackPlugin
                           from "clean-webpack-plugin";
import webpack             from "webpack";
import {
	htmlTemplatePath, outputPath__CSS, outputPath__HTML, outputPath__JS,
	publicURL__CSS, publicURL__HTML, publicURL__IMG, publicURL__JS, publicURL__vendor, relativeCSS_output_filename, relativeHTML_output_filename
}                          from "./paths";
import HtmlWebpackHarddiskPlugin
                           from "html-webpack-harddisk-plugin";
import HardSourceWebpackPlugin
                           from 'hard-source-webpack-plugin';

const IS_PROD                 = __CONFIGURATION__.ENVIRONMENT === 'production';
const extractTextPlugin       =
	      new ExtractTextPlugin({filename: relativeCSS_output_filename});
const htmlPlugin              =
	      new HtmlPlugin({
		                     title:             __CONFIGURATION__.APP_NAME,
		                     template:          htmlTemplatePath,
		                     alwaysWriteToDisk: true,
		                     inlineSource:      '.(js|css)$',
		                     filename:          relativeHTML_output_filename,
		                     public:            {
			                     img:    publicURL__IMG,
			                     vendor: publicURL__vendor,
			                     html:   publicURL__HTML,
			                     css:    publicURL__CSS,
			                     js:     publicURL__JS,
		                     }
	                     });
const cleanWebpackPlugin      = new CleanWebpackPlugin([`${outputPath__JS}/*`, `${outputPath__CSS}/*`],
                                                       {allowExternal: true});
let stringifiedEnv            = JSON.stringify(process.env.NODE_ENV || 'development');
const definePlugin            = new webpack.DefinePlugin({'process.env.NODE_ENV': stringifiedEnv});
const prodPlugins             = [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})];
const devPlugins              = [new HtmlWebpackHarddiskPlugin({outputPath: path.resolve(outputPath__HTML)})];
const hardSourceWebpackPlugin = new HardSourceWebpackPlugin({
	                                                            apply: function (compiler) {
		                                                            compiler.plugin('compilation', function (compilation) {
			                                                            compilation.plugin('optimize-chunk-order', function () {
				                                                            if (compilation.usedChunkIds) {
					                                                            var usedChunkIds = {};
					                                                            for (var key in compilation.usedChunkIds) {
						                                                            if (compilation.usedChunkIds[key] < 100000) {
							                                                            usedChunkIds[key] = compilation.usedChunkIds[key];
						                                                            }
					                                                            }
					                                                            compilation.usedChunkIds = usedChunkIds;
				                                                            }
			                                                            });
		                                                            });
	                                                            },
                                                            });

export const webpackPlugins = [
	extractTextPlugin,
	// Create an HTML file that will include the files we tryna
	htmlPlugin,
	// Remove the old CSS and JavaScript files
	cleanWebpackPlugin,
	// Define the environment
	definePlugin,
	// Better caching
	hardSourceWebpackPlugin,
	...(IS_PROD ? prodPlugins : devPlugins)
];
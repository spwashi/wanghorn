import ExtractTextPlugin   from "extract-text-webpack-plugin";
import {__CONFIGURATION__} from "../../config/config";
import {inputPath__CSS}    from "./paths";

const IS_PROD      = __CONFIGURATION__.ENVIRONMENT === 'production';
export const rules = [
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
		exclude: /node_modules\/(?!spwashi-sm|base-components)/,
		use:     [{
			loader:  'babel-loader',
			options: {
				cacheDirectory: true,
				babelrc:        true
			}
		}],
	}
];

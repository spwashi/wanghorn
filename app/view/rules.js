import ExtractTextPlugin from "extract-text-webpack-plugin";
import {inputPath__CSS} from "./paths";
import {ENVIRONMENT} from "../../config/config";

const IS_PROD = ENVIRONMENT === 'production';
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
        exclude: /node_modules\/(?!spwashi-sm)/,
        use:     [{
            loader:  'babel-loader',
            options: {
                cacheDirectory: true,
                babelrc:        '/var/www/wanghorn/app/.babdsdsdsdsdlrc'
            }
        }],
    }
];

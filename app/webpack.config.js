import HtmlPlugin from "html-webpack-plugin";
import path from "path";

const URL        = 'http://localhost/wanghorn/';
const app_name   = "example-app";
const outputPath = path.resolve(__dirname, '../public/js');


module.exports   = {
    entry:   './resources/js/app',
    output:  {
        filename:   `${app_name}.js`,
        publicPath: `${URL}public/js/`,
        path:       outputPath
    },
    devtool: 'source-map',
    module:  {
        loaders: [{
            test:    /\.js$/,
            exclude: /node_modules/,
            loader:  'babel-loader'
        }],
    },
    plugins: [
        new HtmlPlugin({template: 'view/html/react.html'})
    ]
};
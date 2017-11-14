const path       = require('path');
const HtmlPlugin = require('html-webpack-plugin');
const URL        = 'http://localhost/wanghorn/';
const app_name   = "example-app";


module.exports   = {
    entry:   './app/resources/js/app',
    output:  {
        filename:   `${app_name}.js`,
        publicPath: `${URL}public/js/`,
        path:       `${__dirname}/public/js`
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
        new HtmlPlugin({template: 'app/view/html/react.html'})
    ]
};
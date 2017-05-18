var path = require('path');
var fs = require('fs');
var webpack = require('webpack');

/**
 * Found some guidance here
 * http://stackoverflow.com/questions/29911491/using-webpack-on-server-side-of-nodejs
 */
var nodeModules = fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    });

module.exports = {
    stats: {
        warnings: false
    },
    //entry: './lib/test.js',
    entry: './lib/main.js',
    target: 'node',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DefinePlugin({"global.GENTLY": false})
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel-loader?cacheDirectory=true',
            }
        ],
    },
    devtool: 'source-map',
    recordsPath: path.join(__dirname, 'build/_records')
};
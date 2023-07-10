'use strict';

const webpack = require('webpack'),
    path = require('path'),
    {merge} = require('webpack-merge'),
    ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const common = require('./webpack.common.js');
const source = path.join(__dirname, '../source');

module.exports = merge(common, {
    mode: 'development',

    devtool: 'inline-source-map',

    entry: {
        main: ['webpack-hot-middleware/client', source + '/scripts/index'],
    },

    // devServer: {
    //     historyApiFallback: true,
    //     contentBase: paths.build,
    //     open: true,
    //     compress: true,
    //     hot: true,
    //     port: 8880,
    // },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshPlugin({
            overlay: {
                sockIntegration: 'whm',
            },
        }),
    ],
});

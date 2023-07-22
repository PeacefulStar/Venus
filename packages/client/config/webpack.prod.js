'use strict';

const path = require('path'),
    {merge} = require('webpack-merge'),
    {CleanWebpackPlugin} = require('clean-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    TerserPlugin = require('terser-webpack-plugin');

const common = require('./webpack.common.js');
const source = path.join(__dirname, '../source');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    entry: {
        main: [source + '/scripts/index'],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    optimization: {
        minimize: true,
        minimizer: [new OptimizeCssAssetsPlugin(), new TerserPlugin()],
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});

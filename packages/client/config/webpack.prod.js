'use strict';

const path = require('path'),
    // glob = require('glob'),
    {merge} = require('webpack-merge'),
    // MiniCssExtractPlugin = require('mini-css-extract-plugin'),
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
    // output: {
    //     path: paths.build,
    //     publicPath: '/',
    //     filename: 'js/[name].[contenthash].bundle.js',
    // },
    plugins: [
        new CleanWebpackPlugin(),
        // new MiniCssExtractPlugin({
        //     filename: 'styles/[name].[contenthash].css',
        //     chunkFilename: '[id].css',
        // }),
    ],
    // module: {
    //     rules: [
    //         {
    //             test: /\.(scss|css)$/,
    //             use: [
    //                 MiniCssExtractPlugin.loader,
    //                 {
    //                     loader: 'css-loader',
    //                     options: {
    //                         importLoaders: 2,
    //                         sourceMap: false,
    //                     },
    //                 },
    //                 'postcss-loader',
    //                 'sass-loader',
    //             ],
    //         },
    //     ],
    // },
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

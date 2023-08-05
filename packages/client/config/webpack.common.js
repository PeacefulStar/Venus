'use strict';

const webpack = require('webpack'),
    path = require('path'),
    // glob = require('glob'),
    ESLintPlugin = require('eslint-webpack-plugin'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const source = path.join(__dirname, '../source');

module.exports = {
    context: source,
    output: {
        path: path.join(__dirname, '../destination'),
        publicPath: '/',
        filename: 'scripts/[name].js',
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/[hash].hot-update.json',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
            chunkFilename: 'styles/[id].css',
        }),
        new HtmlWebpackPlugin({
            favicon: source + '/images/favicon.ico',
            template: source + '/html/index.html',
            filename: 'index.html',
            meta: {
                'description': { name: 'description', content: 'The future is yet in your power' },
                // 'keyword': { name: 'keywords', content: '...' },
                'og:site_name': { property: 'og:site_name', content: 'PeacefulStar' },
                'og:title': { property: 'og:title', content: 'PeacefulStar' },
                'og:description': { property: 'og:description', content: 'The future is yet in your power' },
                'og:type': { property: 'og:type', content: 'website' },
                'og:url': { property: 'og:url', content: 'https://peacefulstar.art' },
                'og:image': { property: 'og:image', content: 'https://peacefulstar.art/images/og.png' },
                'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
                'twitter:title': { name: 'twitter:title', content: 'PeacefulStar' },
                'twitter:description': { name: 'twitter:description', content: 'The future is yet in your power' },
                'twitter:image': { name: 'twitter:image', content: 'https://peacefulstar.art/images/og.png'  }
            }
        }),
        new ESLintPlugin()
    ],
    resolve: {
        extensions: [
            '.js',
            '.json',
            '.jsx',
            '.scss',
            '.css',
            '.pcss',
            '.ts',
            '.tsx',
        ],
        modules: ['node_modules'],
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: source,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
            {
                test: /\.s?p?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[local]--[hash:base64:5]',
                            },
                            sourceMap: true,
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                loader: 'html-loader',
            },
            {
                test: /\.(png|jpe?g|gif|ico|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: './images/[name].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|woff2?)$/,
                type: 'asset/resource',
                generator: {
                    filename: './fonts/[name].[ext]'
                }
            },
            {
                test: /\.(mp4|ogv|webm)$/,
                type: 'asset/resource',
                generator: {
                    filename: './movie/[name].[ext]'
                }
            },
            {
                test: /\.pdf$/,
                type: 'asset/resource',
                generator: {
                    filename: './pdf/[name].[ext]'
                }
            },
        ],
    },
};

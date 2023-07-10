// const path = require('path');

module.exports = {
    syntax: 'postcss-scss',
    plugins: {
        'postcss-extend': {},
        'postcss-import': {},
        'postcss-mixins': {},
        'postcss-preset-env': {
            browsers: ['last 2 versions', '> 5%'],
            autoprefixer: {grid: true},
            features: {
                'nesting-rules': true,
            },
        },
        'postcss-url': {
            // url: 'copy',
            // basePath: path.join(__dirname, 'source'),
            // assetPath: 'images',
            // from: 'source/styles/postcss/main.module.pcss',
            // to: 'destination/styles/main.module.css'
        },
    },
};

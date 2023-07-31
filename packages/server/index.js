require('@babel/register')({
    presets: ['@babel/preset-env'],
});

let path;
if (process.env.NODE_ENV === 'production') {
    path = './bin/www';
} else if (process.env.NODE_ENV === 'development') {
    path = './dev'
}

require(path);

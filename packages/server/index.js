require('@babel/register')({
    presets: ['@babel/preset-env'],
});

let path;
if (process.env.NODE_ENV === 'production') {
    path = './bin/www';
} else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'virtual') {
    path = './dev'
}

require(path);

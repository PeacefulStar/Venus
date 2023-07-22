const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const mongoose = require('mongoose');
const config = require('../client/config/webpack.dev');
const compiler = webpack(config);
require('dotenv').config({path: '../../.env'});

import index from './routes/index';
import graphql from './routes/graphql';
import well from './routes/well-known';

const app = express();
const port = process.env.PORT;

app.use('/', index);
app.use('/graphql', graphql);
app.use('/.well-known/acme-challenge/', well);
app.use(
    webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
    })
);

app.use(
    webpackHotMiddleware(compiler, {
        log: false,
        path: '/__webpack_hmr',
        heartbeat: 10 * 1000,
    })
);

app.get('*', (req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
        res.set('content-type', 'text/html');
        res.send(result);
        res.end();
    });
});

let ip;
if (process.env.NODE_ENV === 'development') {
  ip = '127.0.0.1';
} else if (process.env.NODE_ENV === 'virtual') {
  ip = 'mongo'
}

mongoose.connect(`mongodb://${ip}:${process.env.DB_PORT}/${process.env.DB_NAME}`, )
  .then(() => console.log('mongoose connection successful'))
  .catch((err) => console.error('mongoose', err));

app.listen(port, () => console.log(`Server is listening on port: ${port}`));

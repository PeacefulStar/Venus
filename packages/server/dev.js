import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from '../client/config/webpack.dev';
import dotenv from 'dotenv';
dotenv.config({path: '../../.env'});

import index from './routes/index';
import graphql from './routes/graphql';
import well from './routes/well-known';

const compiler = webpack(config);
const app = express();
const {PORT, NODE_ENV, USER, DB_PORT, TYPE} = process.env;

console.log(PORT, NODE_ENV, USER, DB_PORT, TYPE)

app.use(cookieParser());
app.use(cors(), bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
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
if (TYPE === 'virtual') {
  ip = 'mongodb'
} else {
  ip = '127.0.0.1';
}
console.log(ip)

mongoose.connect(`mongodb://${ip}:${DB_PORT}/${USER}`,
  {useNewUrlParser: true, useUnifiedTopology: true,})
  .then(() => console.log('mongoose connection successful'))
  .catch((err) => console.error('mongoose', err));

app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));

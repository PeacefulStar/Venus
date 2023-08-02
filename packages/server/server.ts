import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import mongoose from 'mongoose';
import http from 'http';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import logger from 'morgan';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import dotenv from 'dotenv';

import config from '../client/config/webpack.dev';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';
import well from './routes/well-known';

dotenv.config({path: '../../.env'});

const { NODE_ENV, USER, DB_PORT, TYPE} = process.env;
const app = express();
const compiler = webpack(config);

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors(), bodyParser.json());
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

(async () => {
  let ip;
  if (TYPE === 'virtual') {
    ip = 'mongodb'
  } else {
    ip = '127.0.0.1';
  }

  await mongoose.connect(`mongodb://${ip}:${DB_PORT}/${USER}`,)
    .then(() => console.log('mongoose connection successful'))
    .catch((err) => console.error('mongoose', err));

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    // context: async ({ req, res }) => ({ req, res, getAuthUser }),
  });

  await apolloServer.start();

  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }));

  app.get('*', (req, res) => {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      res.set('content-type', 'text/html');
      res.send(result);
      // res.end();
    });
  });

  if (NODE_ENV === 'production') {
    await new Promise<void>((resolve) => httpServer.listen(80, resolve));
    console.log('HTTP Server running on port 80');

    const credentials = {
      key: fs.readFileSync('/etc/letsencrypt/live/peacefulstar.art-0001/privkey.pem'),
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/peacefulstar.art-0001/fullchain.pem',
      ),
      ca: fs.readFileSync('/etc/letsencrypt/live/peacefulstar.art-0001/chain.pem'),
    };
    const httpsServer = https.createServer(credentials, app);
    await new Promise<void>((resolve) => httpsServer.listen(443, resolve));
    // console.log('HTTPS Server running on port 443');
  } else if (NODE_ENV === 'development') {
    await new Promise<void>((resolve) => httpServer.listen(3000, resolve));
    // console.log('Server running on port 3000');
  }
})();

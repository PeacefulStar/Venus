import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import mongoose from 'mongoose';
import http from 'http';
import https from 'https';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
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
// import ask from './routes/ask';
// import well from './routes/well-known';

dotenv.config({ path: '../../.env' });

const { PORT, NODE_ENV, USER, PASS, DB_PORT, TYPE } = process.env;
console.log(PORT, NODE_ENV, USER, PASS, DB_PORT, TYPE);
const app = express();
const compiler = webpack(config);

const corsOptions = {
  origin: [
    'https://peacefulstar.art',
    'https://studio.apollographql.com',
    'http://localhost:3000',
    // 'http://127.0.0.1:3000',
  ],
  credentials: true,
};

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions), bodyParser.json());
// app.use('/ask/', ask);
// app.use('/.well-known/acme-challenge/', well);
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  }),
);

app.use(
  webpackHotMiddleware(compiler, {
    log: false,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000,
  }),
);

(async () => {
  let ip: string;
  if (TYPE === 'virtual') {
    ip = 'mongodb';
  } else {
    ip = '127.0.0.1';
  }

  const url = `mongodb://${USER}:${PASS}@${ip}:${DB_PORT}/${USER}`;

  await mongoose
    .connect(url)
    .then(() => console.log('mongoose connection successful'))
    .catch((err) => console.error('mongoose', err));

  app.use(
    session({
      name: 'session',
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      proxy: true,
      store: MongoStore.create({
        mongoUrl: url,
        ttl: 14 * 24 * 60 * 60, // = 14 days. Default
      }),
      cookie: {
        secure: NODE_ENV !== 'development',
        path: '/',
        sameSite: 'strict',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
      },
    }),
  );

  const httpServer = http.createServer(app);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req, res }) => ({ req, res }),
    }),
  );

  app.get('*', (req, res) => {
    console.log(req.protocol, 119);
    console.log(req.headers, 120);
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  });

  if (NODE_ENV === 'production') {
    // await new Promise<void>((resolve) => httpServer.listen(80, resolve));
    // console.log('HTTP Server running on port 80');

    const credentials = {
      key: fs.readFileSync(
        '/etc/letsencrypt/live/peacefulstar.art-0001/privkey.pem',
      ),
      cert: fs.readFileSync(
        '/etc/letsencrypt/live/peacefulstar.art-0001/fullchain.pem',
      ),
      ca: fs.readFileSync(
        '/etc/letsencrypt/live/peacefulstar.art-0001/chain.pem',
      ),
    };
    const httpsServer = https.createServer(credentials, app);
    await new Promise<void>((resolve) => httpsServer.listen(443, resolve));
    console.log('HTTPS Server running on port 443');
  } else if (NODE_ENV === 'development') {
    await new Promise<void>((resolve) => httpServer.listen(3000, resolve));
    console.log('Server running on port 3000');
  }
})();

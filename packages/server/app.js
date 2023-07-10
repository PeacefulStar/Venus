import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import fs from 'fs';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
require('dotenv').config({path: '../../.env'});

import index from './routes/index';
import graphql from './routes/graphql';
import well from './routes/well-known';

const handleRender = (req, res) => {
    const html = ReactDOMServer.renderToString();

    fs.readFile(
        path.join(__dirname, '../client/destination/index.html'),
        'utf8',
        (err, data) => {
            if (err) {
                throw err;
            }

            const document = data.replace(
                /<div id="root"><\/div>/,
                `<div id="root">${html}</div>`,
            );

            res.send(document);
        },
    );
}

const app = express();

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors(), bodyParser.json());
app.use('/', index);
app.use('/graphql', graphql);
app.use('/.well-known/acme-challenge/', well);
app.use(express.static(path.join(__dirname, '../client/destination')));
app.get('*', handleRender);
mongoose.connect(`mongodb://${process.env.DB_NAME}:${process.env.DB_PASS}@127.0.0.1:${process.env.DB_PORT}/${process.env.DB_NAME}`, )
    .then(() => console.log('mongoose connection successful'))
    .catch((err) => console.error('mongoose', err));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
// app.use((req, res, next) => {
//     console.log(req);
//     console.log(res);
//     console.log(next);
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.send({
//         message: err.message,
//         error: err,
//     });
// });

module.exports = app;

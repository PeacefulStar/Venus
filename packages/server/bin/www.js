#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('venus:server');
const http = require('http');
const https = require('https');
const fs = require('fs');
// const path = require('path');
const dns = require('dns');
const {Resolver} = require('dns');

const resolver = new Resolver();
require('dotenv').config({path: '../../../.env'});

const options = {
    family: 4,
    hints: dns.ADDRCONFIG || dns.V4MAPPED,
};

/**
 * Get port from environment and store in Express.
 */
console.log('27', process.env.PORT, process.env.NODE_ENV, process.env.DB_NAME);

const port = normalizePort(process.env.PORT);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
console.log(port);
server.listen(port, () => console.log(`Server is listening on port: ${port}`));
server.on('error', onError);
server.on('listening', onListening);

if (process.env.NODE_ENV === 'production') {
    // dns.lookup('www.js.peastar.net', options, (err, address, family) => {
    //     console.log(err);
    //     console.log('address:', address);
    //     console.log(family);
    //     dns.reverse(address, (error, hostname) => {
    //         console.log('52: ', hostname);
    //         if (error) {
    //             console.log(error.stack);
    //         }
    //
    //         console.log(
    //             'reverse for ' + address + ': ' + JSON.stringify(hostname),
    //         );
    //     });
    // });
    //
    // dns.lookupService('192.168.0.9', 80, (err, hostname, service) => {
    //     console.log('64: ', hostname, service);
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    //
    // dns.lookupService('127.0.0.1', 80, (err, hostname, service) => {
    //     console.log('71: ', hostname, service);
    //     if (err) {
    //         console.log(err);
    //     }
    // });
    //
    // resolver.setServers(['192.168.0.9', '127.0.0.1']);
    //
    // resolver.resolve4('peastar.net', (err, addresses) => {
    //     console.log('81: ', addresses);
    //     if (err) {
    //         console.log('82: ', err);
    //     }
    // });
    //
    // resolver.resolve4('www.js.peastar.net', (err, addresses) => {
    //     console.log('87: ', addresses);
    //     if (err) {
    //         console.log('89: ', err);
    //     }
    // });
    //
    // resolver.resolveAny('www.js.peastar.net', (err, ret) => {
    //     if (err) {
    //         console.log(`err: ${err}`);
    //     } else {
    //         console.log(`ret: ${JSON.stringify(ret)}`);
    //     }
    // });

    const credentials = {
        key: fs.readFileSync('/etc/letsencrypt/live/peacefulstar.art-0001/privkey.pem'),
        cert: fs.readFileSync(
            '/etc/letsencrypt/live/peacefulstar.art-0001/fullchain.pem',
        ),
        ca: fs.readFileSync('/etc/letsencrypt/live/peacefulstar.art-0001/chain.pem'),
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
    httpsServer.on('error', onError);
    httpsServer.on('listening', onListening);
}
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const portNum = parseInt(val, 10);

    if (isNaN(portNum)) {
        // named pipe
        return val;
    }

    if (portNum >= 0) {
        // port number
        return portNum;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use!');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

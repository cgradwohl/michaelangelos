/**
 * This file is used to configure the API gateway, start it, and have it listen on a port.
 * This file listens for a request, handles that request and then formats a response.
 
 */
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const path = require('path');
const StringDecoder = require('string_decoder').StringDecoder;

const config = require('../config');
const handlers = require('./handlers');
const utils = require('../utils');

const gateway = {};

// instantiate the HTTP server
gateway.httpServer = http.createServer(function(req, res) {
    gateway.unifiedServer(req, res);
});

// instantiate the HTTPS server
// gateway.httpsServerOptions = {
//     'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
//     'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
// };
// gateway.httpsServer = https.createServer(gateway.httpsServerOptions, function(req, res) {
//     gateway.unifiedServer(req, res);
// });

// All the server logic for both http and https server
gateway.unifiedServer = function(req, res) {
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    
    // get the path form that url
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // get the query string as an object
    const queryStringObj = parsedUrl.query;

    // get the http method
    const method = req.method.toLowerCase();

    // get the headers as an object
    const headers = req.headers;

    // get the payload, if payload exists
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    
    // payload of the req is being streamed in via the 'data' event
    // this is a node js WritableStream instance 
    req.on('data', function(data) {
        buffer += decoder.write(data)
    });

    // end gets called for every request regardless if it has payload
    req.on('end', function() {
        buffer += decoder.end();

        // choose the handler this req should go to 
        const chosenHandler = typeof(gateway.router[trimmedPath]) !== 'undefined' ? gateway.router[trimmedPath] : handlers.notFound;
        
        // Create the request data obj to send to handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObj': queryStringObj,
            'method': method,
            'headers': headers,
            'payload': utils.parseJsonToObject(buffer)
        }

        // Handle the request
        chosenHandler(data, (statusCode, payload) => {
            // use the status code called back by the handler, or default to 200
            
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            
            // use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // convert the payload to a string
            const payloadString = JSON.stringify(payload);


            
            // return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log("returning the response", statusCode, payloadString);
        }); 
    });
}

// define a request router, keys - paths, values - handler functions
// TODO: gateway endpoints maps to multiple services calls, which are executed async by handler functions
// handlers may call one service or they may call multiple services
gateway.router = {
    'ping': handlers.ping,
    'api/v0/signup': handlers.signup,
    'api/v0/login': handlers.login,
    'api/v0/logout': handlers.logout,
    'api/v0/menu': handlers.menu,
    // 'cart': handlers.cart,
    // 'checkout': handlers.checkout
}


gateway.init = function() {
    // Start the HTTP server
    gateway.httpServer.listen(config.gateway.httpPort, function() {
        console.log('\x1b[36m%s\x1b[0m', "API Gateway : "+config.gateway.httpPort);
    });

    // Start the HTTPS server 
    // gateway.httpsServer.listen(config.gateway.httpsPort, function() {
    //     console.log('\x1b[35m%s\x1b[0m', "the server is listening on port: "+config.gateway.httpsPort);
    // });
}

module.exports = gateway;
const http = require('http');

const handlers = require('./handlers');
const config = require('../../config');

const cart = {}

cart.httpServer = http.createServer(function(req, res) {
    cart.unifiedServer(req, res);
});

// instantiate the HTTPS server
// cart.httpsServerOptions = {
//     'key' : fs.readFileSync(path.join(__dirname, '/../https/key.pem')),
//     'cert' : fs.readFileSync(path.join(__dirname, '/../https/cert.pem'))
// };
// cart.httpsServer = https.createServer(cart.httpsServerOptions, function(req, res) {
//     cart.unifiedServer(req, res);
// });

// All the server logic for both http and https server
cart.unifiedServer = function(req, res) {
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
        const chosenHandler = typeof(cart.router[trimmedPath]) !== 'undefined' ? cart.router[trimmedPath] : handlers.notFound;
        
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

cart.router = {
    'ping': handlers.ping
}

cart.init = function() {
    // Start the HTTP server
   cart.httpServer.listen(config.cart.httpPort, function() {
        console.log('\x1b[36m%s\x1b[0m', "Cart Service : "+config.cart.httpPort);
    });

    // Start the HTTPS server 
    // cart.httpsServer.listen(config.httpsPort, function() {
    //     console.log('\x1b[35m%s\x1b[0m', "the server is listening on port: "+config.httpsPort);
    // });
}

module.exports = cart;
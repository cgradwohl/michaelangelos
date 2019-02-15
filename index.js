const services = require('./services');
const gateway = require('./gateway');

const app = {};

app.init = function() {

    // Start MicroServices - TODO perhaps these should be indpendant :)
    services.init();
   
    // Start API Gateway
    gateway.init();
};

app.init();
module.exports = app;
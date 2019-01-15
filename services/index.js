const users = require('./users');
// const token = require('./token');
// const session = require('./session');
// const inventory = require('./inventory');
const cart = require('./cart');
// const order = require('./order');

const services = {}

/**
 * @NOTE I beleive Docker will/ can coordinate this process
 */
services.init = function() {

    users.init();
    // token.init();
    // session.init();
    // inventory.init();
    cart.init();
    // order.init();

    // Send to console in yellow
    console.log('\x1b[33m%s\x1b[0m', 'Micro Services up and running.');
};

module.exports = services;``
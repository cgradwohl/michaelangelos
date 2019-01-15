const notFound = require('./notFound');
const ping = require('./ping');
const signup = require('./signup');
const login = require('./login');
const logout = require('./logout');
const menu = require('./menu');


const handlers = {
    notFound,
    ping,
    signup,
    login,
    logout,
    menu
}

module.exports = handlers;

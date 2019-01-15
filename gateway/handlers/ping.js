// Ping handler
ping = function(data, callback) {
    callback(200, {'ping': 'pong'})
};

module.exports = ping;
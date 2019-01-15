const handlers = {}

// Users handler
handlers.ping = function(data, callback) {
    const acceptableMethods = ['get'];
    if(acceptableMethods.indexOf(data.method) > -1){
        callback(200, {'ping': 'pong'})
    } else {
        callback(405);    
    }
};

module.exports = handlers;
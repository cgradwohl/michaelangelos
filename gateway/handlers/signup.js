const signup = function(data, callback){
    const acceptableMethods = ['post'];
    if(acceptableMethods.indexOf(data.method) > -1){
        createUser()
        .then(res => loginUser()
        .then(res => returnRes()))
        handlers[data.method](data, callback);
    } else {
        callback(405);    
    }
};

handlers = {}

const createUser = new Promise((resolve, reject) => {
    

});

module.exports = signup;

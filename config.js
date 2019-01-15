/**
 * Centralized Config for microservices
 */
const  environments = {};

// Staging (default) environment
environments.staging = {
    'gateway': {
        'httpPort': 4000,
        'httpsPort': 4001
    },
    'cart': {
        'httpPort': 4100,
        'httpsPort': 4101
    },
    'users': {
        'httpPort': 4200,
        'httpsPort': 4201 
    },
    'envName': 'staging',
    'hashingSecret': 'sacredsecret',
};

// Production environment (port 443 https, port 80 http)
environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashingSecret': 'sacredsecret',
};

// Determine which environments was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : "";

// check that the environment was passed is a valid argument
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
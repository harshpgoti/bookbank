const AWS = require('aws-sdk'),
    { awsSDK: awsSDKConfig } = require('../config/default.json'),
    { awsSDK: awsSecrets } = require('../config/secrets.json');

AWS.config.update({
    region: awsSDKConfig.region,
    accessKeyId: awsSecrets.accessKeyId,
    secretAccessKey: awsSecrets.secretAccessKey,
});

AWS.config.getCredentials(function(err) {
    if(err) 
        console.log(err);
});

module.exports = AWS;
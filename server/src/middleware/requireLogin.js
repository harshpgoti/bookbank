const jwt = require('jsonwebtoken'),
    { JWT_SECRET, awsDynamoDBTables } = require('../config/secrets.json'),
    AWS = require('../helper/aws-sdk')

module.exports = (req,res,next)=>{
    const { authorization } = req.headers;
    const docClient = new AWS.DynamoDB.DocumentClient();
    
    if(!authorization){
        return res.status(400).json({error:"Please login"});
    }
    jwt.verify(authorization,JWT_SECRET,(err,email)=>{
        if(err)
            return res.status(400).json({error:"Please login"});

        var params = {
            TableName: awsDynamoDBTables.usersTable,
            Key: {
                "email_id": email.data
            }
        };
        docClient.get(params, function (err, data) {
            if (err){
                console.log("users::auth::error");
                return res.status(400).json({error:"invalid data"});
            }
            else{
                next()
            }
        });
    })
}
const express = require('express'),
 router = express.Router(),
 multer = require('multer'),
 multerS3 = require('multer-s3'),
 { awsSDK } = require('../config/default.json'),
 jwt = require('jsonwebtoken'),
 { JWT_SECRET, awsDynamoDBTables } = require('../config/secrets.json'),
 requirLogin = require('../middleware/requireLogin'),
 AWS = require('../helper/aws-sdk'),
 upload = require('../middleware/awss3')

const s3 = new AWS.S3()
const docClient = new AWS.DynamoDB.DocumentClient();

router.post('/upload', requirLogin, upload.single('book'),(req,res)=>{
    const {bookname} = req.body;
    if(req.file){
        const { authorization } = req.headers;
        jwt.verify(authorization,JWT_SECRET,(err,email)=>{
            if(err)
                res.status(422).json({error:"Please login"});
            else{
                var params = {
                    TableName: awsDynamoDBTables.docsTable,
                    Item:  {
                        "email_id": email.data,
                        "bookname":bookname,
                        "key": req.file.key,
                        "location":req.file.location
                    }
                };
                docClient.put(params, function (err, data) {
                    if (err){
                        console.log("users::data insert::error");
                        res.status(422).json({error:"something wrong please try again"});  
                    }                   
                    else 
                        res.status(200).json({entry:"book added"});
                });
            }
        })
    }
    else{
        res.status(422).json({error:"PDF or EPUB file Only allowed! / max file size 2MB"})
    }
});

router.post('/updatebookdetails', requirLogin, upload.single('updatedbook'),(req,res)=>{
    const { bookname,updatedBookName,key } = req.body;
    if(req.file){
        const { authorization } = req.headers;
        jwt.verify(authorization,JWT_SECRET,(err,email)=>{
            if(err)
                res.status(422).json({error:"Please login"});
            else{
                s3.deleteObject({ Bucket: awsSDK.bucketName, Key: key }, function(err, data) {
                    if (err) res.status(422).json({error:"Please try again"});
                    else{
                        let params = {
                            TableName: awsDynamoDBTables.docsTable,
                            Key:  {
                                "email_id": email.data,
                                "bookname": bookname
                            }
                        };
                        docClient.delete(params, function (err, data) {
                            if (err){
                                console.log("users::data delete::error",err);
                                res.status(422).json({error:"something wrong please try again"});  
                            }                   
                            else {
                                var params = {
                                    TableName: awsDynamoDBTables.docsTable,
                                    Item:  {
                                        "email_id": email,
                                        "bookname":updatedBookName,
                                        "key": req.file.key,
                                        "location":req.file.location
                                    }
                                };
                                docClient.put(params, function (err, data) {
                                    if (err){
                                        console.log("users::data update::error");
                                        res.status(422).json({error:"something wrong please try again"});  
                                    }                   
                                    else 
                                        res.status(200).json({entry:"book updated"});
                                });
                            }
                        });
                    }
                });
            }
        })
    }
    else{
        res.status(422).json({error:"PDF or EPUB file Only allowed! / max file size 2MB"})
    }
});

router.post('/viewbooks', requirLogin,(req,res)=>{
    const {authorization} = req.headers;
    jwt.verify(authorization,JWT_SECRET,(err,email)=>{
        if(err)
            res.status(422).json({error:"Please login"});
        else{
            var params = {
                TableName: awsDynamoDBTables.docsTable,
                KeyConditionExpression: 'email_id = :email_id',
                ExpressionAttributeValues: {
                    ':email_id': email.data
                },
            };
            docClient.query(params, function (err, data) {
              if (err){
                console.log("users::auth::error",err);
                res.status(422).json({error:"something wrong please try again"});  
              } else {
                res.status(200).json(data.Items);
              }
            })
        }
    })

});

router.post('/viewAllBooks',(req,res)=>{
        
    var params = {
        TableName: awsDynamoDBTables.docsTable,
    };
    docClient.scan(params, function (err, data) {
        if (err){
        console.log("users::auth::error",err);
        res.status(422).json({error:"something wrong please try again"});  
        } else {
        res.status(200).json(data);
        }
    })

});

router.delete("/deleteFile", async (req, res) => {
    const {email_id,bookname,key} = req.body.fileData;
    const authorization = req.body.headers.Authorization;
    
    jwt.verify(authorization,JWT_SECRET,(err,email)=>{
        if(err)
            res.status(422).json({error:"Please login"});
        else{
            if(email.data == email_id){
                s3.deleteObject({ Bucket: awsSDK.bucketName, Key: key }, function(err, data) {
                    if (err) res.status(422).json({error:"Please try again"});
                    else{
                        var params = {
                            TableName: awsDynamoDBTables.docsTable,
                            Key:  {
                                "email_id": email_id,
                                "bookname": bookname
                            }
                        };
                        docClient.delete(params, function (err, data) {
                            if (err){
                                console.log("users::data delete::error",err);
                                res.status(422).json({error:"something wrong please try again"});  
                            }                   
                            else 
                                res.status(200).json({entry:"book deleted"});
                        });
                    }
                });
            } else{
                res.status(401).json({error:"Unauthorized"});
            }
        }
    })
})

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(422).json({ error: 'Maintain file size blow 2MB' })
        }
    }
})

module.exports = router;
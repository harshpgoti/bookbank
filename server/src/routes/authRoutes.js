const express = require('express'),
 router = express.Router(),
 bcrypt = require('bcryptjs'),
 jwt = require('jsonwebtoken'),
 { JWT_SECRET, awsDynamoDBTables } = require('../config/secrets.json'),
 requirLogin = require('../middleware/requireLogin'),
 AWS = require('../helper/aws-sdk'),
 packageInfo = require('../../package.json'),
 nodemailer = require('nodemailer'),
 nm = require('../helper/nodemailer')

const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/',(req,res)=>{
    res.status(200).json({
      message: 'Health: OK',
        app: packageInfo.name,
        description: packageInfo.description,
        author: packageInfo.author,
        license: packageInfo.license,
        repository: packageInfo.repository,
        contributors: packageInfo.contributors
  });
});

router.post('/signup',(req,res)=>{
  const {name,email,password} = req.body;
  if(!name || !email || !password){
    return res.status(400).json({error:"add all data"});
  }
  var params = {
    TableName: awsDynamoDBTables.usersTable,
    Key: {
        "email_id": email
    }
  };
  docClient.get(params, function (err, data) {
    if (err) {
      console.log("users::email check::error");
      res.status(400).json({error:"something wrong please try again"});
    }
    else {
      if(data.Item)
        res.status(400).json({error:"email address already register"})
      else{
        bcrypt.hash(password,12)
          .then(hashedPassword=>{
          var params = {
            TableName: awsDynamoDBTables.usersTable,
            Item:  {
              "email_id": email,
              "name": name,
              "password":hashedPassword
            }
          };
          docClient.put(params, function (err, data) {
            if (err){
              console.log("users::bcrypt for register::error");
              res.status(400).json({error:"something wrong please try again"});  
            }                   
            else 
              res.status(200).json({entry:"register"});
          });
        });
      }
    }
  });
});

router.post('/signin',(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
      return res.status(422).json({error:"add all data"});
  }
  var params = {
      TableName: awsDynamoDBTables.usersTable,
      Key: {
        "email_id": email
      }
  };
  docClient.get(params, function (err, data) {
    if (err){
      console.log("users::auth::error");
      res.status(422).json({error:"something wrong please try again"});
    } else {
      bcrypt.compare(password,data.Item.password)
      .then(doMatch=>{
        if(doMatch){
          const token = jwt.sign({data:data.Item.email_id}, JWT_SECRET , {expiresIn: 60*60*12 });
          if (!token) 
            return res.status(422).json({error:"please try again"});
          res.status(200).json({token});
        }else
          return res.status(422).json({error:"invalid password"});
      })
      .catch(err=>{
        console.log("users::bcrypt::error",err);
        res.status(422).json({error:"email id or password incorrect"});  
      })
    }
  });
});

router.put('/changepassword', requirLogin,(req,res)=>{
  const {pass,newPass} = req.body;
  const { authorization } = req.headers;
  if(!pass || !newPass){
    res.status(422).json({error:"add all data"});
  } else{
    jwt.verify(authorization,JWT_SECRET,(err,email)=>{
      var params = {
        TableName: awsDynamoDBTables.usersTable,
        Key: {
            "email_id": email.data
        }
      };
      docClient.get(params, function (err, data) {
        if (err){
          console.log("users::auth::error");
          res.status(422).json({error:"something wrong please try again"});  
        } else {
          bcrypt.compare(pass,data.Item.password)
          .then(doMatch=>{
            if(doMatch){
              bcrypt.hash(newPass,12)
              .then(hashedPassword=>{
                var params = {
                  TableName: awsDynamoDBTables.usersTable,
                  Key:  {
                    "email_id": email
                  },
                  UpdateExpression: "set #passwd = :passwdvalue",
                  ExpressionAttributeNames: {
                      "#passwd": "password"
                  },
                  ExpressionAttributeValues: {
                      ":passwdvalue": hashedPassword
                  }
                };
                docClient.update(params, function (err, data) {
                  if (err){
                    console.log("users::pass update::error",err);
                    res.status(422).json({error:"something wrong please try again"});  
                  }                   
                  else{
                    res.status(200).json({entry:"password updated"});
                  }
                });
              });
            }else
              return res.status(422).json({error:"invalid password"});
          })
          .catch(err=>{
            console.log("users::bcrypt::error");
            res.status(422).json({error:"email id or password incorrect"});  
          })
        }
      });
    });
  }
});

router.post('/forgotpassword',(req,res)=>{
  const {email} = req.body;
  if(!email){
    return res.status(422).json({error:"enter email"});
  }
  var params = {
    TableName: awsDynamoDBTables.usersTable,
    Key: {
      "email_id": email
    }
  };
  docClient.get(params, function (err, data) {
    if (err){
      console.log("users::email get::error");
      res.status(422).json({error:"something wrong please try again"});
      const token = jwt.sign({data:data.Item.email_id+data.Item.password}, JWT_SECRET, {expiresIn: 60*5});
      if (!token) 
        return res.status(422).json({error:"please try again"});
      let body=`Forgot password link:<a href="http://localhost:3000/recover/${token}">forgot your password</a></br><p>This link will expire in 5 minutes</p>`
      nm(data.Item.email_id, "forgot your password",body)
      .then(info => {
        return res.status(200).json({entry:"email sended"});
       })
      .catch(error => {
        console.log("error",error)
        return res.status(422).json({error});
      });
    }
  });
});

router.post('/checkrecovertoken',(req,res)=>{
  const {token} = req.body;
  if(!token){
    return res.status(422).json({error:"invalid token"});
  }
  var params = {
    TableName: awsDynamoDBTables.usersTable
  };
  docClient.scan(params, function (err, data) {
    if (err){
      console.log("users::scan token::error");
      res.status(422).json({error:"something wrong please try again"});  
    } else {
      let tempToken,jwtverifedToken,userEmail;
      data.Items.forEach(users => {
        jwt.verify(token,JWT_SECRET,(err,verifedToken)=>{
          jwtverifedToken=verifedToken;
          if(err){
            return res.status(422).json({error:"something wrong please try again"});  
          }
          else if(users.email_id+users.password == verifedToken.data){
            tempToken = users.email_id+users.password;
            userEmail = jwt.sign(users.email_id, JWT_SECRET);
            if (!userEmail) 
              return res.status(422).json({error:"please try again"});
          }
        });
      });
      if(tempToken == jwtverifedToken){
        return res.status(200).json({entry:"done"});
      } else {
        return res.status(422).json({error:"something wrong please try again"});  
      }
    }
  });
});

router.put('/recoverpassword',(req,res)=>{
  const {newPass,token} = req.body;
  if(!newPass || !token){
    return res.status(422).json({error:"please enter password"});
  }
  var params = {
    TableName: awsDynamoDBTables.usersTable
  };
  docClient.scan(params, function (err, data) {
    if (err){
      console.log("users::scan token::error");
      res.status(422).json({error:"something wrong please try again"});  
    } else {
      let tempToken=false,usersEmail;
      data.Items.forEach(users => {
        jwt.verify(token,JWT_SECRET,(err,verifedToken)=>{
          if(err){
            return res.status(422).json({error:"something wrong please try again"});  
          }
          else if(users.email_id+users.password == verifedToken.data){
            tempToken=true;
            usersEmail=users.email_id;
          }
        });
      });
      if(tempToken){
        bcrypt.hash(newPass,12)
        .then(hashedPassword=>{
          var params = {
            TableName: awsDynamoDBTables.usersTable,
            Key:  {
            "email_id": usersEmail
            },
            UpdateExpression: "set #passwd = :passwdvalue",
            ExpressionAttributeNames: {
                "#passwd": "password"
            },
            ExpressionAttributeValues: {
                ":passwdvalue": hashedPassword
            }
          };
          docClient.update(params, function (err, data) {
            if (err){
            console.log("users::pass update::error",err);
            res.status(422).json({error:"something wrong please try again"});  
            }                   
            else{
            res.status(200).json({entry:"password updated"});
            }
          });
        });
      } else {
        return res.status(422).json({error:"something wrong please try again"});  
      }
    }
  });
});

module.exports = router;
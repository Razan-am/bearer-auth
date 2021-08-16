'use strict';

const base64 = require('base-64')

const basicAuth = (UserSchema) => async(req,res,next)=>{
  if (!req.headers['authorization']){
    next('No Authorization info');
    return;
  }
 
  let basicHeaderParts = req.headers.authorization.split(' '); 
  let encoded = basicHeaderParts.pop();
  let decoded = base64.decode(encoded); 
  let [username, password] = decoded.split(':'); 

  

  UserSchema.authenticatBasic(username,password).then(validUser =>{
    req.user = validUser;
    next();
  }).catch(error => next('Invalid Login'))

  
};

module.exports=basicAuth;
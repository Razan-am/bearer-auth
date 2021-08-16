'use strict';

const base64 = require('base-64');
// const {UserSchema}= require('../models/index')
const UserModel= require('../models/user-model')

const bearerAuth = (UserSchema) => (req,res,next) =>{

    if (!req.headers['authorization']) {
        next('No Authorization info');
        return;
    }
    let basicHeaderParts = req.headers.authorization.split(' '); 
    let token = basicHeaderParts.pop();
    UserSchema.authenticateToken(token).then(userObject=> {
        req.user = userObject;
        next();
    }).catch(err=> next('Invalid Token'))
}

module.exports = bearerAuth
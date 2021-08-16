'use strict';

require('dotenv').config();

const SECRET = process.env.SECRET || 'mysecretkey';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const UserSchema = (sequelize,DataTypes) =>{
    
    const UserModel = sequelize.define('lab7',{
        username:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        password:{
            type: DataTypes.STRING,
            allowNull: false, 
        },
        token:{
            type:DataTypes.VIRTUAL,
            get(){
                return jwt.sign({username:this.username},SECRET);
            },
            set(tokenObj){
                return jwt.sign(tokenObj,SECRET);
            }
        }
    });

    UserModel.authenticatBasic = async function (username,password){
        const user = await this.findOne({ where: {username:username} });
        console.log("authenticateBasic user : ", user);
        console.log("password :", password);
        console.log("user.password : ", user.password);
        const valid = await bcrypt.compare(password, user.password);
        console.log("valid : ", valid);
        if (valid) {
            return (user);               
        }
        throw new Error('invalide username or password');
    };

    UserModel.authenticatToken = async function(token){

        try{
            const parsedToken = jwt.verify(token,SECRET);
            console.log('parsedToken....',parsedToken);
            const user = await this.findOne({ where: {username:parsedToken.username} });
            if(user){
                return (user,jwt.sign(username,SECRET, { expiresIn: '900s' }));
            }
            throw new Error('Invalid token');
        }catch(error){throw new Error(error.message)}
    }
    return UserModel;
}
    
module.exports=UserSchema;
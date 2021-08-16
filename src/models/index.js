'use strict';

require("dotenv").config();

const UserSchema = require('./user-model');
const {Sequelize,DataTypes}=require('sequelize');

const POSTGRESS_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : 'postgres://localhost:5432/lab7';

const sequelize = new Sequelize(POSTGRESS_URI,{});

module.exports={
    UserSchema:UserSchema(sequelize,DataTypes),
    db:sequelize
}
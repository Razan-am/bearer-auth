'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const pageNotFound=require('./error/404');
const errorHandller=require('./error/500');


const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');

const Users= require('./models/user-model');
const {Sequelize,DataTypes}=require('sequelize');

const POSTGRESS_URI = process.env.NODE_ENV === 'test' ? 'sqlite:memory' : 'postgres://localhost:5432/lab7';

const sequelize = new Sequelize(POSTGRESS_URI,{});
const UserSchema = Users(sequelize, DataTypes);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
  res.send('Every thing is working fine')
});

app.get('/status',(req,res)=>{
  res.send({
      domain:'https://bearer-authh.herokuapp.com/',
      status:'running',
      port:'8000',
  })
})

app.post('/signup',async (req,res,next)=>{

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const record = await UserSchema.create({
      username : req.body.username,
      password: req.body.password,
    });
    console.log('record >>>>> ', req.record);
    res.status(200).json(record);
  } catch (e) {
    console.log(e);
    res.send('Invalid signing up');  
  }
});

app.post('/signin',basicAuth(UserSchema),async(req, res,next) => {
  const user =req.user;
  await res.status(200).json(user);
});

app.get('/secretstuff',bearerAuth(UserSchema),(req,res)=>{
  res.json(req.user)
});

app.get('/test',(req,res)=>{
res.json({
  massege:'hello',
})
});

function start(port){
  app.listen(port,()=>{
    console.log(`listening to port ${port}`);
  });
}

app.use('*',pageNotFound);
app.use(errorHandller);

module.exports={
  app:app, 
  start:start,  
};
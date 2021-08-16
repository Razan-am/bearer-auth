'use strict';

const express = require('express');
const router = express.Router();
const bcrypt =require('bcrypt');

const basicAuth = require('./middleware/basicAuth');
const bearerAuth = require('./middleware/bearerAuth');

const {UserSchema} = require('./models/index');


router.get('./',(req,res)=>{
    res.send('Every thing is working fine')
});

router.get('./status',(req,res)=>{
    res.send({
        domain:'https://bearer-authh.herokuapp.com/',
        status:'running',
        port:'8000',
    })
})

router.post('/signup',async (req,res,next)=>{

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
   

router.post('/signin',basicAuth(UserSchema),async(req, res,next) => {
    const user =req.user;
    await res.status(200).json(user);
});

router.get('/secretstuff',bearerAuth(UserSchema),(req,res)=>{
    res.json(req.user)
});

router.get('/test',(req,res)=>{
  res.json({
    massege:'hello',
  })
});


module.exports = router;
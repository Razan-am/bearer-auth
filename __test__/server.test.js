'use strict';

const server = require('../src/server');
const supertest = require('supertest');
const request = supertest(server.app);

describe('My API server',()=>{
    
  beforeEach(()=>{
    jest.spyOn(console,'log').mockImplementation();
  });

  it('Not found Request',async()=>{
    const response = await request.get('/abs');
    expect(response.status).toEqual(404);
  });

  it ('bad method',async()=>{
    const response = await request.post('/');
    expect(response.status).toEqual(404);
  });

  it ('working route',async()=>{
    const response = await request.get('/');
    expect(response.status).toEqual(200);
  });

  it('Sign in', async () => {
    const response = await request.post('/signin').auth('test','testing'); 
    expect(response.status).toEqual(200);
  });

  it('Sign up', async () => {
    let obj ={
      username:'test',
      password:'testing',
    };
    const response = await request.post('/signup').send(obj); 
    expect(response.status).toEqual(200);
  });
});
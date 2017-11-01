"use strict";
const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const httpSignature = require('http-signature');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contract = require('truffle-contract');
const superSecretToken = 'asdasdasdasd';
const utils = require('ethereumjs-util');
const BigNumber = require('bignumber.js');

const activeTokens = {};
const generateToken = ()=>{
    return 'supersecrettoken';
};
const registerToken = (token)=>{
    activeTokens[token] = true;
};
const verifyToken = (token)=>{
    console.log(`token is ${token}`);
    console.log(activeTokens);
    return (activeTokens[token] === true);
}

app.use(koaBody());
app.use(async (ctx, next) =>{
    if (ctx.path === '/token'){
        const token = generateToken();
        registerToken(token);
        ctx.body=token;
    }
    await next();
});

app.use(async (ctx) =>{
    if(ctx.path === '/'){
        const token = ctx.request.body.token;
        if(verifyToken(token)) {
            ctx.body = 'token is correct, Hello from my API';
        }
        else{
            ctx.throw(401, 'invalid token, access denied');
        }
    }
})

app.listen(3001);

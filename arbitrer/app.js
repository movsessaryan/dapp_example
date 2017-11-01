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
const request = require('request-promise');

const getToken = async (resourceUri)=>{
    const options = {
        method: 'GET',
        "Content-type": 'application/json',
        uri : resourceUri.concat('/token'),
        json: true // Automatically stringifies the body to JSON
    };
    const token = await request(options);
    console.log(`token is ${ token }`);
    return token;
};
const parseSignature = (msg, signature) => {
    signature = signature.substr(2); //remove 0x
    const r = '0x' + signature.slice(0, 64);
    const s = '0x' + signature.slice(64, 128);
    const v = '0x' + signature.slice(128, 130);
    const v_decimal = web3.toDecimal(v) +27;

    const publicKey = utils.ecrecover(
        utils.hashPersonalMessage(utils.toBuffer(msg)),
        v_decimal,
        utils.toBuffer(r),
        utils.toBuffer(s)
    );

    const address = utils.bufferToHex(utils.pubToAddress(publicKey));
    console.log('the address obtaioned from signature is:');
    console.log(address);
    return address
  };

const isValidTransaction = (transaction, from,to,minAmountWei)=>{
    return (transaction.from === from && transaction.to === to &&  transaction.value.gte(minAmountWei));
};

  app.use(koaBody());
  app.use(async (ctx,next) =>{
      const address = ctx.request.body.address;
      const transactionHash = ctx.request.body.transactionHash;
      //ctx.request.body.hash should be signed
      const signature = ctx.request.body.signature;
      ctx.request.body.signatureAddress = parseSignature(transactionHash,signature,address);
      await next();
  });

  app.use(async (ctx) => {
      const body = ctx.request.body;
      if (ctx.path === '/token'){
            const transaction = web3.eth.getTransaction(body.transactionHash);
            console.log('the transaction is:');
            console.log(transaction);
            const transactionVerified = isValidTransaction(transaction,
                    body.signatureAddress,
                    body.accountToPay,
                    new BigNumber('1000000000000000000'));
            if(transactionVerified){
                console.log(`transaction verified requesting resource for acess token, resource uri is: ${body.resourceUri}`);
                const token = await getToken(body.resourceUri);
                console.log(`access token obtained is: ${token}`);
                ctx.body = token;
            }
      }
  });


  app.listen(3000);

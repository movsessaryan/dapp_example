const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const httpSignature = require('http-signature');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contract = require('truffle-contract');
const validator = contract(require('../build/contracts/Validator.json'));
const superSecretToken = 'asdasdasdasd';
const utils = require('ethereumjs-util');

const verifySignature = async (msg, signature, address) => {
//  console.log(address);
  console.log('that was message');

  console.log(signature);
  console.log("vs");
  signature = signature.substr(2); //remove 0x
  const r = '0x' + signature.slice(0, 64);
  const s = '0x' + signature.slice(64, 128);
  const v = '0x' + signature.slice(128, 130);
  const v_decimal = web3.toDecimal(v) +27;
  console.log(utils.toRpcSig(v_decimal,r,s));



  console.log(`\nv isssss: ${v_decimal}\n`);

  const addr = await utils.ecrecover(
     utils.hashPersonalMessage(utils.toBuffer(msg)),
     v_decimal,
     utils.toBuffer(r),
     utils.toBuffer(s)
   );
   console.log('-----data------');
   console.log(`input addr ==> ${address}`);
   console.log(`output key => ${addr}`);
   console.log(`output addr => ${utils.pubToAddress(addr)}`);

  }

  app.use(koaBody());
  app.use(async (ctx,next) =>{
    const address = ctx.request.body.address;
    const transactionHash = ctx.request.body.transactionHash;
    //ctx.request.body.hash should be signed
    const signature = ctx.request.body.signature;
    ctx.request.body.verified = await verifySignature(transactionHash,signature,address);
    await next();
  })
  app.use(async function(ctx) {
      if (ctx.path === '/token'){
          if(ctx.request.body.verified){
            console.log(web3.eth.getTransaction(ctx.requst.body.transactionHash));
          }
          else{
            console.log('Invalid signature!!!');
          }
      }
  });
  app.listen(3000);

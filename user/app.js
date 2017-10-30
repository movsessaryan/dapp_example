const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const httpSignature = require('http-signature');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const contract = require('truffle-contract');
const offer = contract(require('../build/contracts/Offer.json'));
const request = require('request-promise');
const address = web3.eth.accounts[0];
const instantiateContract = () => {
  offer.setProvider(web3.currentProvider);
  return offer.deployed();
};

instantiateContract().then(async (offerInstance)=>{
  const account_to_pay = await offerInstance.account_to_pay();
  web3.eth.sendTransaction({
    from: address,
    to: account_to_pay,
    value: web3.toWei(1, 'ether')
  },
  async (err, transactionHash)=>{
    const signature = web3.eth.sign(address, transactionHash);
    const uri = (await offerInstance.arbiterUri()).concat('/token');
    let options = {
      method: 'POST',
      "Content-type": 'application/json',
      uri,
      body: {
          address,
          transactionHash,
          signature,
      },
      json: true // Automatically stringifies the body to JSON
    };
    console.log(options);
    request(options)
      .then(function (parsedBody) {
          console.log('suceeeeessssssssss\n')
          console.log(parsedBody);
      })
      .catch(function (err) {
          console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr\n");
        //  console.log(err);
      });
  });
}).catch(e=>console.log(e));

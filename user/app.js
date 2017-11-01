"use strict";
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

const makeApiCall = (uri, token)=>{
    const options = {
        method: 'POST',
        uri,
        body: {
            token: token
        },
        json: true
    };
    return request(options);
}
instantiateContract().then(async (offerInstance)=>{
  const accountToPay = await offerInstance.account_to_pay();
  const resourceUri = await offerInstance.resourceUri();

  console.log(`transfering 1 ether to resource owner account: ${accountToPay}`);
  web3.eth.sendTransaction({
    from: address,
    to: accountToPay,
    value: web3.toWei(1, 'ether')
  },
  async (err, transactionHash)=>{
      console.log(`transaction complete, the hash is: ${transactionHash}`);

      const signature = web3.eth.sign(address, transactionHash);
      const uri = (await offerInstance.arbiterUri()).concat('/token');
      const options = {
        method: 'POST',
        "Content-type": 'application/json',
        uri,
        body: {
            transactionHash,
            signature,
            accountToPay,
            resourceUri
        },
        json: true
      };

      console.log('requesting arbitrer for access token, request options are:');
      console.log(options);
      const token = await request(options);
      console.log(`access token obtained is: ${token}`);
      console.log(`making call to API: ${resourceUri}`)
      const response  = await makeApiCall(resourceUri, token);
      console.log('API call completed, the response is:');
      console.log(response);
  });
}).catch(e=>console.log(e));

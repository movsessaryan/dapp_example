var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var Validator = artifacts.require("./Validator.sol");
var Offer = artifacts.require("./Offer.sol");
module.exports = function(deployer) {
  deployer.deploy(Offer);
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(Validator);
//  console.log(`>>>>>adress is${Offer.address}`)
};

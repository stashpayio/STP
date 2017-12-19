//NB - change from mocked contracts to non-mocked version
var STP = artifacts.require("STPMock");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(STP);
};
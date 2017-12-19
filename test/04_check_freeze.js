const STP = artifacts.require("STPMock");

const assertFail = require("./helpers/assertFail");

contract('Check Freeze', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];
  var adviser_3 = accounts[5];

  // =========================================================================
  it("01. Adviser tokens can be frozen", async () => {
    var stp = await STP.deployed();  

    // remap addresses
    await stp.mockSaleAddress(sale);
    await stp.mockBountyAddress(adviserAndBounty);

    // transfer to adviser address
    await stp.distributeAdviserBounty(adviser_1, 50000000000000, true);
     // transfer to adviser address
    await stp.distributeAdviserBounty(adviser_2, 50000000000000, false);

    // check sale balance
    assert.equal(await stp.balanceOf(adviser_1), 50000000000000, "Adviser 1 should have 500000 tokens")
    assert.equal(await stp.balanceOf(adviserAndBounty), 3900000000000000, "Adviser and Bounty fund should have 39.5 million");

    // adviser 1 should not be able to spend 
    await assertFail(async () => {
      await stp.transfer(adviser_2, 50000000000000, {from: adviser_1});      
    });

    // adviser 2 should be able to transfer
    await stp.transfer(adviser_3, 50000000000000, {from: adviser_2});  
    assert.equal(await stp.balanceOf(adviser_3), 50000000000000, "Adviser 1 should have 500000 tokens");
  }); 

  it("02. Frozen account can still register public key", async () => {
    var stp = await STP.deployed();     

    await stp.registerKey('1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', {from: adviser_1});
    
    assert.equal(await stp.publicKeys(adviser_1), '1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', "Public Key should be equal to 1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX");  
  }); 

  it("03. Cannot map when contract stopped", async () => {
    var stp = await STP.deployed();     

    await stp.mock

    await stp.registerKey('1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', {from: adviser_1});
    
    assert.equal(await stp.publicKeys(adviser_1), '1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', "Public Key should be equal to 1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX");  
  }); 

});
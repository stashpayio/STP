const STP = artifacts.require("STPMock");

const assertFail = require("./helpers/assertFail");

contract('Check Burn', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];
  var adviser_3 = accounts[5];
  var adviser_4 = accounts[6];

  // =========================================================================
  it("01.Tokens should be burnable", async () => {
    var stp = await STP.deployed();  

    // remap addresses
    await stp.mockSaleAddress(sale);
    await stp.mockBountyAddress(adviserAndBounty);    
    
    // burn 1 million from the sale address
    await stp.burn(100000000 * TOKEN_DECIMALS, '', {from: sale});
     
    // check sale balance
    assert.equal(await stp.balanceOf(sale), (360000000 - 100000000) * TOKEN_DECIMALS, "Sale should have 260 Million tokens");
  }); 

  it("02.Should not be able to burn more tokens than balance", async () => {
    var stp = await STP.deployed();    
  
    // should not be able to burn more than balance
    await assertFail(async () => {
      await stp.burn(260000001 * TOKEN_DECIMALS, '', {from: sale});   
    });         
  }); 

  it("03.Should be able to burn all the balance", async () => {
    var stp = await STP.deployed();

    // burn 1 million from the sale address
    await stp.burn(260000000 * TOKEN_DECIMALS, '', {from: sale});
  
    assert.equal(await stp.balanceOf(sale), 0, "Balance should be zero");    
  }); 

  it("04. Should not be able to burn when balance is zero", async () => {
    var stp = await STP.deployed();

    // should not be able to burn more than balance
    await assertFail(async () => {
      await stp.burn(100 * TOKEN_DECIMALS, '', {from: sale});   
    });         
  });
  
  it("05. When frozen should be able to burn", async () => {
    var stp = await STP.deployed();

     // transfer to adviser address
    await stp.distributeAdviserBounty(adviser_4, 10000 * TOKEN_DECIMALS, true);

    assert.equal(await stp.isFrozen(adviser_4), true, "Adviser 4 should be frozen");    

    await stp.burn(10000 * TOKEN_DECIMALS, '6b0e2b3b2e8d1f881b46b0bcda3ec2c28e84080f7a8f1b8837e013ae25db5638001a1d902a5611ff2dbcd514a8a84f587b8525eea470198d3e53c3c595c05b72', {from: adviser_4});   

    assert.equal(await stp.balanceOf(adviser_4), 0, "Balance should be zero");          

    assert.equal(await stp.getData(adviser_4), '6b0e2b3b2e8d1f881b46b0bcda3ec2c28e84080f7a8f1b8837e013ae25db5638001a1d902a5611ff2dbcd514a8a84f587b8525eea470198d3e53c3c595c05b72', "Balance should be zero");
  });
});
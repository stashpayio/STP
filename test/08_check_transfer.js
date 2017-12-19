const STP = artifacts.require("STPMock");

const assertFail = require("./helpers/assertFail");

contract('Check Transfers', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];
  var adviser_3 = accounts[5];
  var adviser_4 = accounts[6];

  it("01. Should be able to transfer from sale address", async () => {
    var stp = await STP.deployed(); 
    await stp.mockSaleAddress(sale);                  

    await stp.transfer(adviser_1, 1000 * TOKEN_DECIMALS, {from : sale});
    await stp.transfer(adviser_2, 10000 * TOKEN_DECIMALS, {from : sale});

    assert.equal(await stp.balanceOf(adviser_1), 1000 * TOKEN_DECIMALS, "adviser 1 balance should be 1000");         
    assert.equal(await stp.balanceOf(adviser_2), 10000 * TOKEN_DECIMALS, "adviser 2 balance should be 10,000");   
    assert.equal(await stp.balanceOf(sale), (360000000 * TOKEN_DECIMALS) - (11000 * TOKEN_DECIMALS), "sale be 359,989,000");       
  });

  it("02. Owner only should be able to call distribution complete", async () => {
    var stp = await STP.deployed();     

    await assertFail(async () => {
      await stp.distributionComplete({from : adviser_1});
    });

    await stp.distributionComplete();
  });     

  it("03. Should not be able to transfer from sale after distribution complete", async () => {
    var stp = await STP.deployed();    

    // sale should not be able to spend 
    await assertFail(async () => {
      await stp.transfer(adviser_2, 1000, {from: sale});      
    });
    
    // eveyone-else should not be able to spend 
    await stp.transfer(adviser_1, 1000, {from: adviser_2});
  }); 

  it("04. Should be able to approve and transfer", async () => {
    var stp = await STP.deployed();  
    
    await stp.distributeAdviserBounty(adviser_3, 2000 * TOKEN_DECIMALS, true);

    assert.equal(await stp.balanceOf(adviser_3), 2000 * TOKEN_DECIMALS, "Adviser 3 should have 2000 frozen tokens");

    // adviser 3 approves adviser 2 to spend their funds
    await stp.approve(adviser_2, 1500 * TOKEN_DECIMALS, {from: adviser_3 });

    // adviser 3 cannot transfer funds because they are frozen
    await assertFail(async () => {
      await stp.transferFrom(adviser_3, adviser_4, 1000 * TOKEN_DECIMALS, {from: adviser_2});      
    });

    await stp.approve(adviser_1, 10000 * TOKEN_DECIMALS, {from: adviser_2 });

    // adviser 3 cannot transfer funds because they are frozen
    await stp.transferFrom(adviser_2, adviser_4, 1000 * TOKEN_DECIMALS, {from: adviser_1});      

    assert.equal(await stp.balanceOf(adviser_4), 1000 * TOKEN_DECIMALS, "Adviser 4 should have 1000 frozen tokens");  
  }); 


  it("05. Should not be able to spend more than authorised ", async () => {
    var stp = await STP.deployed();    

    // sale should not be able to spend 
    await assertFail(async () => {
      await stp.transfer(adviser_3, 1600, {from: adviser_2});      
    });
    
    // eveyone-else should not be able to spend 
    await stp.transfer(adviser_1, 1000, {from: adviser_2});
  });

});              
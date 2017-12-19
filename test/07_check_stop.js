const STP = artifacts.require("STPMock");

const assertFail = require("./helpers/assertFail");

contract('Check Contract Stop', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];
  var adviser_3 = accounts[5];

  // =========================================================================
  it("01. Should not be able to call stop while contract time not up", async () => {
      var stp = await STP.deployed(); 
                              
      await assertFail(async () => {
        await stp.stop();
      }); 
  });

  it("02. Should be able to transfer while contract time not up", async () => {
    var stp = await STP.deployed(); 
    await stp.mockSaleAddress(sale);                  

    await stp.transfer(adviser_1, 1000 * TOKEN_DECIMALS, {from : sale});
    await stp.transfer(adviser_2, 10000 * TOKEN_DECIMALS, {from : sale});

    assert.equal(await stp.balanceOf(adviser_1), 1000 * TOKEN_DECIMALS, "adviser 1 balance should be 1000");         
    assert.equal(await stp.balanceOf(adviser_2), 10000 * TOKEN_DECIMALS, "adviser 2 balance should be 10,000");   
    assert.equal(await stp.balanceOf(sale), (360000000 * TOKEN_DECIMALS) - (11000 * TOKEN_DECIMALS), "sale be 359,989,000");   
  });

  it("03. Should be able to call stop after contract time is up", async () => {
    var stp = await STP.deployed();     

    await stp.mockTimeTransferableNow();        
    await stp.stop();  
  });     

  it("04. Should not be able to transfer when stopped", async () => {
    var stp = await STP.deployed();    

    // adviser 1 should not be able to spend 
    await assertFail(async () => {
      await stp.transfer(adviser_2, 1000, {from: sale});      
    });

    await assertFail(async () => {
      await stp.transfer(adviser_1, 1000, {from: adviser_2});      
    });

  });     

  it("05. Should not be able to register public key when stopped", async () => {
    var stp = await STP.deployed(); 

    // adviser 1 should not be able to register key 
    await assertFail(async () => {
      await stp.registerKey('1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8Lhy', {from: sale});
    });
  });     
});              
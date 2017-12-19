const STP = artifacts.require("STPMock");

const assertFail = require("./helpers/assertFail");

contract('Register Public Key', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];
  var adviser_3 = accounts[5];

  // =========================================================================
  it("01. Should not be able to register a public key with no balance", async () => {
      var stp = await STP.deployed();  
            
      // should not be able to burn more than balance
      await assertFail(async () => {
        await stp.registerKey('1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8Lhy', {from: sale});
      }); 
  });              
  
  // =========================================================================
  it("02. Should be able to register a public key with a balance", async () => {
      var stp = await STP.deployed();  
    
      stp.mockSaleAddress(sale);

      await stp.registerKey('1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8Lhy', {from: sale});

      assert.equal(await stp.publicKeys(sale), '1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8Lhy', "Public Key should be equal to 1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8Lhy");        
  }); 

  // =========================================================================
  it("03. Should be able to overwrite a public key", async () => {
    var stp = await STP.deployed();  
    
    await stp.registerKey('1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', {from: sale});
    
    assert.equal(await stp.publicKeys(sale), '1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX', "Public Key should be equal to 1X7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhX");  
  });
  
  it("04. Should not be able to register a public key that is too long", async () => {
    var stp = await STP.deployed();  
          
    // should not be able to burn more than balance
    await assertFail(async () => {
      await stp.registerKey('1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWF7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWX', {from: sale});
    }); 
  });

  it("05. Should be able to change the public key size", async () => {
    var stp = await STP.deployed();  

    await stp.modifyPublicKeySize(75);
          
    assert.equal(await stp.publicKeySize.call(), 75, "Public Key should be changeable");  
  });

  it("06. Should be able to register a longer public key", async () => {
    var stp = await STP.deployed();  

    await stp.registerKey('1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWF7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWX', {from: sale});
          
    // should not be able to burn more than balance
    assert.equal(await stp.publicKeys(sale), '1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWF7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWX', "Public Key should be equal to 1F7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWF7Da6iXhPTp1WbDiEtjGkNfivMEzL8LhyWX");  
  });

  it("07. Non-owner should not be able to change public key size", async () => {
    var stp = await STP.deployed();  
          
    // should not be able to burn more than balance
    await assertFail(async () => {
      await stp.modifyPublicKeySize(95, {from: sale});
    });
  });
});
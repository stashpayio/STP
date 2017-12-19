const STP = artifacts.require("STPMock");

contract('Check Initialisation', function (accounts) {

  var TOKEN_DECIMALS = 10**8;

  var contractOwner = accounts[0];    
  var sale = accounts[1];
  var adviserAndBounty = accounts[2]
  var adviser_1 = accounts[3];
  var adviser_2 = accounts[4];

  // =========================================================================
  it("01. check initial settings", async () => {
    var stp = await STP.deployed();
    
    // remap addresses
    await stp.mockSaleAddress(sale);
    await stp.mockBountyAddress(adviserAndBounty);
    
    //Balances should be zero    
    assert.equal(await stp.totalSupply(), 500000000 * TOKEN_DECIMALS, "total supply should be 500 million supply");   
    assert.equal(await stp.balanceOf(sale), 360000000 * TOKEN_DECIMALS, "sale address should have 360 million supply");     
    assert.equal(await stp.balanceOf(adviserAndBounty), 40000000 * TOKEN_DECIMALS, "adviser and bounty should have 40 million supply");         

    // owners funds    
    assert.equal(await stp.balanceOf("0x7f0dFc26a56B0f7ccd8100eAf31b75dD40BAe01f"), 2000000 * TOKEN_DECIMALS, "Owner 0x7f0dFc26a56B0f7ccd8100eAf31b75dD40BAe01f");
    assert.equal(await stp.balanceOf("0x78c63f73A2f46C19A4CD91e700203bBbe4084093"), 3900000 * TOKEN_DECIMALS, "Owner 0x78c63f73A2f46C19A4CD91e700203bBbe4084093");
    assert.equal(await stp.balanceOf("0x4Ae21E3c9B0E63DbC2832f1Fa3E6e4DD60f42ae1"), 4000000 * TOKEN_DECIMALS, "Owner 0x4Ae21E3c9B0E63DbC2832f1Fa3E6e4DD60f42ae1");
    assert.equal(await stp.balanceOf("0xB9B206c23965553889ebdAEe326D4DA4A457b9b1"), 5000000 * TOKEN_DECIMALS, "Owner 0xB9B206c23965553889ebdAEe326D4DA4A457b9b1");
    assert.equal(await stp.balanceOf("0xD26061A8D47cc712c61A8fa23CE21d593e50F668"), 4000000 * TOKEN_DECIMALS, "Owner 0xD26061A8D47cc712c61A8fa23CE21d593e50F668");
    assert.equal(await stp.balanceOf("0xd69106BE0299d0A83B9a9e32F2df85ec7739FA59"), 3000000 * TOKEN_DECIMALS, "Owner 0xd69106BE0299d0A83B9a9e32F2df85ec7739FA59");
    assert.equal(await stp.balanceOf("0xd6D813fD0394bFeC48996e20D8fBcF55A003C19A"), 4000000 * TOKEN_DECIMALS, "Owner 0xd6D813fD0394bFeC48996e20D8fBcF55A003C19A");
    assert.equal(await stp.balanceOf("0xe34Dc2C4481561224114Ad004C824B1f9E142E31"), 5000000 * TOKEN_DECIMALS, "Owner 0xe34Dc2C4481561224114Ad004C824B1f9E142E31");
    assert.equal(await stp.balanceOf("0x6e19b79B974FA039c1356F6814da22b0a04E8D29"), 3000000 * TOKEN_DECIMALS, "Owner 0x6e19b79B974FA039c1356F6814da22b0a04E8D29");
    assert.equal(await stp.balanceOf("0x5D2F999136e12e54F4a9A873A9d9Ab7407591249"), 4000000 * TOKEN_DECIMALS, "Owner 0x5D2F999136e12e54F4a9A873A9d9Ab7407591249");
    assert.equal(await stp.balanceOf("0x2B0013a364a997b9856127Fd0AbaBEF72baec159"), 3000000 * TOKEN_DECIMALS, "Owner 0x2B0013a364a997b9856127Fd0AbaBEF72baec159");
    assert.equal(await stp.balanceOf("0xDb46260F78EFA6C904D7daFC5C584ca34d5234be"), 4000000 * TOKEN_DECIMALS, "Owner 0xDb46260F78EFA6C904D7daFC5C584ca34d5234be");
    assert.equal(await stp.balanceOf("0x73A4077adf235164f4944f138fC9D982EA549eBA"), 5000000 * TOKEN_DECIMALS, "Owner 0x73A4077adf235164f4944f138fC9D982EA549eBA");
    assert.equal(await stp.balanceOf("0x3617280CAbFE0356A2aF3cB4f652c3acA3ab8216"), 100000  * TOKEN_DECIMALS, "Owner 0x3617280CAbFE0356A2aF3cB4f652c3acA3ab8216");
    assert.equal(await stp.balanceOf("0x3D106C1220C49F75DDb8a475B73a1517cEF163f6"), 2000000 * TOKEN_DECIMALS, "Owner 0x3D106C1220C49F75DDb8a475B73a1517cEF163f6");
    assert.equal(await stp.balanceOf("0xd6AAF14FEE58FD90e6518179e94F02B5e0098A78"), 100000  * TOKEN_DECIMALS, "Owner 0xd6AAF14FEE58FD90e6518179e94F02B5e0098A78");
    assert.equal(await stp.balanceOf("0x9c98c23E430b4270f47685e46d651B9150272B16"), 3900000 * TOKEN_DECIMALS, "Owner 0x9c98c23E430b4270f47685e46d651B9150272B16");
    assert.equal(await stp.balanceOf("0xCC3E7d55bBa108b07c08D014F13FE0eE5c09Ec08"), 2000000 * TOKEN_DECIMALS, "Owner 0xCC3E7d55bBa108b07c08D014F13FE0eE5c09Ec08");
    assert.equal(await stp.balanceOf("0xe4a92D9C2c31789250956b1b0B439cF72baF8a27"), 3000000 * TOKEN_DECIMALS, "Owner 0xe4a92D9C2c31789250956b1b0B439cF72baF8a27");
    assert.equal(await stp.balanceOf("0x2eDc2B7f7191cF9414d9BF8feBDd165B0Cd91EE1"), 4000000 * TOKEN_DECIMALS, "Owner 0x2eDc2B7f7191cF9414d9BF8feBDd165B0Cd91EE1");
    assert.equal(await stp.balanceOf("0x332f79ebB69d00cb3F13FCB2bE185ed944F64298"), 3000000 * TOKEN_DECIMALS, "Owner 0x332f79ebB69d00cb3F13FCB2bE185ed944F64298");
    assert.equal(await stp.balanceOf("0x5594aAE7ae31a3316691Ab7a11dE3DdeE2f015E0"), 6000000 * TOKEN_DECIMALS, "Owner 0x5594aAE7ae31a3316691Ab7a11dE3DdeE2f015E0");
    assert.equal(await stp.balanceOf("0xC08b91c50ed4303D1B90ffd47237195e4bFc165e"), 5000000 * TOKEN_DECIMALS, "Owner 0xC08b91c50ed4303D1B90ffd47237195e4bFc165e");
    assert.equal(await stp.balanceOf("0xbf6F7C6A13b9629B673c023E54Fba4c2cd4CCBBa"), 3000000 * TOKEN_DECIMALS, "Owner 0xbf6F7C6A13b9629B673c023E54Fba4c2cd4CCBBa");
    assert.equal(await stp.balanceOf("0x629048b47eD4fB881bacFb7Ca85E7275CD663CF7"), 4000000 * TOKEN_DECIMALS, "Owner 0x629048b47eD4fB881bacFb7Ca85E7275CD663CF7");
    assert.equal(await stp.balanceOf("0x451861E95aA32Ce053f15F6AE013d1EFaCe88e9e"), 3000000 * TOKEN_DECIMALS, "Owner 0x451861E95aA32Ce053f15F6AE013d1EFaCe88e9e");
    assert.equal(await stp.balanceOf("0x94d79beb8c57e54ff3FcE49AE35078c6df228B9C"), 4000000 * TOKEN_DECIMALS, "Owner 0x94d79beb8c57e54ff3FcE49AE35078c6df228B9C");
    assert.equal(await stp.balanceOf("0xE2b1430B79b5BE8bF3c7d70EB4fAf36926b369F3"), 5000000 * TOKEN_DECIMALS, "Owner 0xE2b1430B79b5BE8bF3c7d70EB4fAf36926b369F3");
    assert.equal(await stp.balanceOf("0x25b772BDa67719D2bA404C04fa4390443bf993eD"), 2000000 * TOKEN_DECIMALS, "Owner 0x25b772BDa67719D2bA404C04fa4390443bf993eD");
  });
});

var STP = artifacts.require("STPMock");

contract('STP', function(accounts) {
  it("01. Should deploy", function(done) {
    var stp = STP.deployed();
    assert.isTrue(true);
    done();
  });
});
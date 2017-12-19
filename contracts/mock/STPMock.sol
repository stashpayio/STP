pragma solidity ^0.4.18;

import '../STP.sol';

contract STPMock is STP {

    function mockSaleAddress(address addr) public {        
                
        balances[addr] = balances[sale];
        balances[sale] = 0;

        sale = addr;
    }

    function mockBountyAddress(address addr) public {

        balances[addr] = balances[adviserAndBounty];
        balances[adviserAndBounty] = 0;

        adviserAndBounty = addr;       
    }

    function mockTimeTransferableNow() public {
        timeTransferbleUntil = now - 1;
    }        
}
pragma solidity ^0.4.16;

/// Implements ERC20 Token standard: https://github.com/ethereum/EIPs/issues/20
/// AUDITED: N
contract ERC20Token {

    event Transfer(address indexed _from, address indexed _to, uint _value);
    event Approval(address indexed _owner, address indexed _spender, uint _value);

    function transfer(address _to, uint _value) public returns (bool);
    function transferFrom(address _from, address _to, uint _value) public returns (bool);
    function approve(address _spender, uint _value) public returns (bool);
    function balanceOf(address _owner) public constant returns (uint);
    function allowance(address _owner, address _spender) public constant returns (uint);    
}

/// @title Abstract token contract - Functions to be implemented by token contracts
/// AUDITED: N
contract Ownable {
    address public owner;

    function Ownable()
        public
    {        
        owner = msg.sender;
    }
 
    modifier onlyOwner {
        assert(msg.sender == owner);    
        _;
    }

    function transferOwnership(address newOwner)
        public
        onlyOwner
    {
        owner = newOwner;
    }
    
    /* DEBUG ONLY 
    function kill() public onlyOwner {
        selfdestruct(owner); 
    }
    */
}


/// @title Simple address locking
/// @dev Contract owner proposes a lock time. The account holder can 
/// approve the lock in which case the account is then locked, or  
/// reject the contract owner's proposal by calling reject lock
/// version 1.03
/// AUDITED: N
contract Lockable is Ownable {

    // custom data structure to hold locked funds and release time
    /// Audited: N
    struct LockInfo {
        bool lockApproved;        
        uint releaseTime;
    }

    /// Audited: N
    mapping (address => LockInfo) public lockedAccounts;
    mapping (address => bool) public frozenAccount;    
    
    /// Audited: N
    event LockProposed(address target, uint releaseTime);
    event LockApproved(address target, uint releaseTime);
    event LockRejected(address target, uint releaseTime);

    /// Audited: N  
    modifier onlyUnlocked(address _target) {
        assert(!isLocked(_target));
        _;
    }

    /// Audited: N
    modifier onlyUnfrozen(address _target) {
        assert(!isFrozen(_target));
        _;
    }
    
    // @dev Owners funds are frozen on token creation and can never
    // be traded. No other accounts can be frozen as there is no method to 
    // freeze after contaract is initilised
    function isFrozen(address _target)
        public
        view
        returns (bool)
    {
        return frozenAccount[_target];
    }

    /// @dev Cannot be spent until releaseTime has passed
    /// Only end user can opt-in to have their account locked 
    /// for example when agreement is made for a bounty or adviser
    /// @return returns true if the release time has not passed
    /// Audited: N
    function isLocked(address _target)
        public
        view
        returns (bool)
    { 
        return lockedAccounts[_target].lockApproved && 
        lockedAccounts[_target].releaseTime >= now;            
    } 

    /// @dev owner of contract proposes lock time to user
    /// user then calls approve lock for actual lock to take effect 
    // Audited: N
    function proposeLock(address _target, uint _releaseTime)
        public
        onlyOwner 
        onlyUnlocked(_target)
    {
        lockedAccounts[_target].releaseTime = _releaseTime;
        LockProposed(_target, lockedAccounts[_target].releaseTime);
    }

    /// @dev owner of contract proposes lock time to user
    /// user then calls approve lock for actual lock to take effect 
    // Audited: N
    function proposeLockInDays(address _target, uint _releaseTimeInDays)
        public
        onlyOwner
        onlyUnlocked(_target)
    {
        proposeLock(_target, now + _releaseTimeInDays * 1 days);        
    }
    
    /// @dev allows user to authorise their account to be locked.
    /// The contract owner proposes the lock time and the user approves 
    /// if they agree with release time set by the contract owner
    /// Audited: N     
    function approveLock()
        public
        onlyUnlocked(msg.sender)
    {
        assert(lockedAccounts[msg.sender].releaseTime > 0); // releaseTime should have been proposed by the contract owner
        lockedAccounts[msg.sender].lockApproved = true;
        LockApproved(msg.sender, lockedAccounts[msg.sender].releaseTime);        
    }

    /// @dev allow user to revoke lock only if their address is 
    /// currently unlocked
    /// Audited: N
    function rejectProposal()
        public
        onlyUnlocked(msg.sender)
    {
        assert(lockedAccounts[msg.sender].releaseTime > 0); // releaseTime should have been proposed by the contract owner
        lockedAccounts[msg.sender].lockApproved = false; //reject approval
        LockRejected(msg.sender, lockedAccounts[msg.sender].releaseTime);
        lockedAccounts[msg.sender].releaseTime = 0; // reset the release time       
    }   
}


/// @title Lockable token contract - Standard token interface implementation with locks
/// adapted from SimpleToken
/// AUDITED: N
contract Token is ERC20Token, Lockable {
    /*
     *  Storage
     */
    mapping (address => uint) balances;
    mapping (address => mapping (address => uint)) allowances;    
    uint    public totalSupply;
    uint    public timeTransferbleUntil = 1538262000;                        // Transferable until 29/09/2018 23:00 pm UTC

    event Burn(address indexed from, uint256 value);

    modifier transferable() {
        assert(now < timeTransferbleUntil);
        _;
    }

    function extendTransferableInMinutes(uint timeInMinutes)
        public
        onlyOwner
    {
        timeTransferbleUntil += timeInMinutes * 1 minutes;
    }

    function extendTransferableInDays(uint timeInDays)
        public
        onlyOwner
    {
        timeTransferbleUntil += timeInDays * 1 days;
    }

     function extendTransferable(uint _timeTransferbleUntil)
        public
        onlyOwner
    {
        assert(_timeTransferbleUntil > timeTransferbleUntil);
        timeTransferbleUntil = _timeTransferbleUntil;
    }

    /*
     *  Public functions
     */
    /// @dev Transfers sender's tokens to a given address. Returns success
    /// @param _to Address of token receiver
    /// @param _value Number of tokens to transfer
    /// @return Returns success of function call
    /// AUDITED: N
    function transfer(address _to, uint _value)
        public
        onlyUnlocked(msg.sender)
        onlyUnfrozen(msg.sender)                                        // Owners funds provably frozen
        transferable()
        returns (bool)        
    {                         
        assert(_to != 0x0);                                             // Prevent transfer to 0x0 address. Use burn() instead
        assert(balances[msg.sender] >= _value);                         // Check if the sender has enough
        assert(balances[_to] + _value >= balances[_to]);                // Check for overflows
        assert(!isFrozen(_to));                                         // Do not allow transfers to frozen accounts
        uint previousBalances = balances[msg.sender] + balances[_to];   // Save this for an assertion in the future
        balances[msg.sender] -= _value;                                 // Subtract from the sender
        balances[_to] += _value;                                        // Add the same to the recipient
        Transfer(msg.sender, _to, _value);                              // Notify anyone listening that this transfer took place
        assert(balances[msg.sender] + balances[_to] == previousBalances);
        return true;       
    }

    /// @dev Allows allowed third party to transfer tokens from one address to another. Returns success
    /// @param _from Address from where tokens are withdrawn
    /// @param _to Address to where tokens are sent
    /// @param _value Number of tokens to transfer
    /// @return Returns success of function call
    /// AUDITED: N
    function transferFrom(address _from, address _to, uint _value)
        public
        onlyUnlocked(_from)          
        onlyUnfrozen(msg.sender)                                        // Owners can never transfer funds
        transferable()                 
        returns (bool)
    {        
        assert(_to != 0x0);                                             // Prevent transfer to 0x0 address. Use burn() instead
        assert(balances[_from] >= _value);                              // Check if the sender has enough
        assert(balances[_to] + _value >= balances[_to]);                // Check for overflows
        assert(_value <= allowances[_from][msg.sender]);                // Check allowance
        assert(!isFrozen(_to));                                         // Do not allow transfers to frozen accounts
        uint previousBalances = balances[_from] + balances[_to];        // Save this for an assertion in the future
        balances[_from] -= _value;                                      // Subtract from the sender
        balances[_to] += _value;                                        // Add the same to the recipient
        allowances[_from][msg.sender] -= _value;
        Transfer(_from, _to, _value);
        assert(balances[_from] + balances[_to] == previousBalances);
        return true;
    }

    /// @dev Sets approved amount of tokens for spender. Returns success
    /// @param _spender Address of allowed account
    /// @param _value Number of approved tokens
    /// @return Returns success of function call
    /// AUDITED: Y
    function approve(address _spender, uint _value)
        public
        returns (bool)
    {
        allowances[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    /// @dev Returns number of allowed tokens for given address
    /// @param _owner Address of token owner
    /// @param _spender Address of token spender
    /// @return Returns remaining allowance for spender
    /// AUDITED: Y
    function allowance(address _owner, address _spender)
        public
        constant
        returns (uint)
    {
        return allowances[_owner][_spender];
    }

    /// @dev Returns number of tokens owned by given address
    /// @param _owner Address of token owner
    /// @return Returns balance of owner
    /// AUDITED: Y
    function balanceOf(address _owner)
        public
        constant
        returns (uint)
    {
        return balances[_owner];
    }

    // @title Destroy tokens
    // @dev remove `_value` tokens from the system irreversibly     
    // @param _value the amount of tokens to burn   
    function burn(uint256 _value) 
        public 
        returns (bool success) 
    {
        assert(balances[msg.sender] > 0);                               // Amount must be greater than zero
        assert(balances[msg.sender] >= _value);                         // Check if the sender has enough
        uint previousTotal = totalSupply;                               // Start integrity check
        balances[msg.sender] -= _value;                                 // Subtract from the sender
        totalSupply -= _value;                                          // Updates totalSupply
        assert(previousTotal - _value == totalSupply);                  // End integrity check 
        Burn(msg.sender, _value);
        return true;
    }
}


contract STP is Token {
    string  public name = "STASHPAY";
    string  public symbol = "STP";
    uint8   public decimals = 8;
    uint8   public publicKeySize = 65;
    address public sale;
    address public adviserAndBounty;
    uint    public dateCreated = now;
    mapping (address => string) public publicKeys;

    event RegisterKey(address indexed _from, string _publicKey);

    function STP(
        address _sale,
        address _adviserAndBounty,
        address[] owners,
        uint[] tokens
        )
    public
        {

        require(_sale != 0 && _adviserAndBounty != 0);   // sale addresses must be specified

        /* 
            Token Distrubution
            -------------------
            500M Total supply
            72% Token Sale
            20% Founders & Devs (provably non-tradable for entire duration of contract)
            8% Bounty and advisters
        */

        sale = _sale;
        adviserAndBounty = _adviserAndBounty;
        totalSupply = 500000000 * 10**uint256(decimals); 
        balances[sale] = 360000000 * 10**uint256(decimals); 
        balances[adviserAndBounty] = 40000000 * 10**uint256(decimals);
            
        Transfer(0, sale, balances[sale]);
        Transfer(0, adviserAndBounty, balances[adviserAndBounty]);
        
        /* 
            Founders & Dev accounts are provably frozen for duration of contract            
        */
        uint assignedTokens = balances[sale] + balances[adviserAndBounty];
        for (uint i = 0; i < owners.length; i++) {
            require (owners[i] != 0);                                               // address must be specified
            tokens[i] = tokens[i] * 10**uint256(decimals);                          // assign corresponding token amount 
            balances[owners[i]] += tokens[i];                                       // update balance
            Transfer(0, owners[i], tokens[i]);                                      // transfer the tokens
            assignedTokens += tokens[i];                                            // keep track of total assigned
            frozenAccount[owners[i]] = true;                                        // Owners funds are provably frozen for duration of contract
        }
        
        /*
            balance check 
        */
        require(assignedTokens == totalSupply);                 
    }  

    /// Register mainnet public key
    /// AUDITED: N
    function register(string publicKey)
    public
    { 
        assert(balances[msg.sender] > 0);
        assert(bytes(publicKey).length <= publicKeySize);
              
        publicKeys[msg.sender] = publicKey;      
    }           

    /// @dev only if we need to make changes to the public size key
    /// bitcoin key size is 65 characters (130 Hex character), zcash z address is 95 (190 Hex characters)
    function modifypublicKeySize(uint8 _publicKeySize)
    public
    onlyOwner
    { 
        publicKeySize = _publicKeySize;
    }

     function distribute(address[] addresses, uint[] tokens)
     public
     onlyOwner
     {
        assert(addresses.length > 0);
        assert(addresses.length == tokens.length);
        
        uint assignedTokens = 0;
        uint previousBalance = balances[sale];

        for (uint i = 0; i < addresses.length; i++) {
            require (addresses[i] != 0);    
            require (tokens[i] != 0);                                         
            tokens[i] = tokens[i] * 10**uint256(decimals);                          
            balances[addresses[i]] += tokens[i];                                       
            Transfer(0, addresses[i], tokens[i]);                                      
            assignedTokens += tokens[i];                                                                                
        }

        assert(balances[sale] + assignedTokens == previousBalance);
     }


    /// @dev when token distrubution is complete freeze any remaining tokens for life of contract
    function distributionComplete()
    public
    onlyOwner
    {
        frozenAccount[sale] = true;
    }
}
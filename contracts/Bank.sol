// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
}

contract Bank {

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address payable public contractOwner;
    uint public totalAccount = 0;
    uint256 public commisson = 0; // in pourcentage 

    constructor(address payable _contractOwner){
        contractOwner = _contractOwner;
    }

    struct Account{
        address payable owner;
        string accountName;
        string description;
        uint256 amount;
        uint256 lockTime;
        uint accountId;
    }

    mapping(uint => Account) public accounts;

    event newDeposit (uint256 amount, uint time, address owner, string accountName);
    event newWithdraw(uint256 amount,uint256 newBalance, address owner, string accoutName);

    modifier onlyOwner(uint _accountId){
        require(getAccount(_accountId).owner == msg.sender);
        _;
    }

    function canWithdraw(uint _accountId) internal view returns(bool){
       Account memory _account = getAccount(_accountId);
       if(msg.sender == _account.owner &&  block.timestamp >= _account.lockTime){
        return true;
       }else{
        return false;
       }
    }

    function deposit(uint256 _amount, uint _accountId) public payable {
        address _depositAddress = payable(msg.sender);

        uint256 _accountBalance = IERC20Token(cUsdTokenAddress).balanceOf(_depositAddress);

        require(_accountBalance > _amount);

        Account memory _account = getAccount(_accountId);

        uint256 _newBalance = _account.amount + _amount;
        
        _account.amount = _newBalance;
        
        emit newDeposit(_amount, _account.lockTime, _depositAddress, _account.accountName);
    }

    function withdraw(uint _accountId, uint256 _amount) public onlyOwner(_accountId) payable {
        Account memory _account = getAccount(_accountId);

        require(_account.amount > _amount, "Don't have enought found");

        if(canWithdraw(_accountId)){
            uint256 _commissonAmount = (_amount * commisson) / 100;
            uint256 _amountToWithdraw = _amount - _commissonAmount;

            IERC20Token(cUsdTokenAddress).transfer(_account.owner, _amountToWithdraw);
            IERC20Token(cUsdTokenAddress).transfer(contractOwner, _commissonAmount);

            uint256 _newBalance = _account.amount - _amountToWithdraw;
            _account.amount = _newBalance;
            emit newWithdraw(_amount, _account.amount, _account.owner, _account.accountName);
        }
    }

    function createAccount(
        string memory _accountName,
        string memory _accountDescription,
        uint _locktime,
        uint _accountId
        ) public returns (bool) {

            accounts[_accountId] = Account(
                payable(msg.sender),
                _accountName,
                _accountDescription,
                0,
                _locktime,
                _accountId
            );

            totalAccount++;

        return true;
    }

    function lockAccount(uint _accountId, uint256 _timestamp) public view{
        require(block.timestamp < _timestamp, "lock time should be in the future");
        Account memory _account = getAccount(_accountId);
        _account.lockTime = _timestamp;
    }

    function deleteAccount(uint _accountId) public onlyOwner(_accountId) returns (bool) {
        Account memory _account = getAccount(_accountId);

        if(_account.amount != 0){
           return false;
        }

        delete accounts[_accountId];
        totalAccount--;
        return true;
    }

    function updateCommission(uint256 newCommission) public {
        require(msg.sender == contractOwner, "Only the owner of this contract can update the commission");
        commisson = newCommission;
    }

    function getContractOwner() public view returns (address){
       return contractOwner;
    }

    function getAccount(uint _accountId) public view returns (Account memory _account) {
       return (accounts[_accountId]);
    }
}

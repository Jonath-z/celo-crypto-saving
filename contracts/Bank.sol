// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    address payable public contractOwner;
    uint public totalAccount = 0;
    uint256 public commisson = 0; // in pourcentage 

    constructor(address payable _contractOwner) {
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
    event locked(Account account);

    modifier onlyAccountOwner(uint _accountId){
        require(accounts[_accountId].owner == msg.sender);
        _;
    }

    modifier onlyContractOwner(){
        require(msg.sender == contractOwner);
        _;
    }

    function lockTimeExpired(uint _accountId) internal view returns(bool){
       Account memory _account = accounts[_accountId];
       if(block.timestamp >= _account.lockTime){
        return true;
       }else{
        return false;
       }
    }

    function deposit(uint _accountId) public payable {
        address _depositAddress = payable(msg.sender);
        uint256 _amount = msg.value;

        Account storage _account = accounts[_accountId];

        uint256 _newBalance = _account.amount + _amount;
        
        _account.amount = _newBalance;
        
        emit newDeposit(_amount, _account.lockTime, _depositAddress, _account.accountName);
    }

    function withdraw(uint _accountId, uint256 _amount) public onlyAccountOwner(_accountId) payable {
        Account storage _account = accounts[_accountId];
        require(_account.amount > _amount, "Don't have enought found");
        require(lockTimeExpired(_accountId), "Can not withdraw, account is still locked");

        uint256 _commissonAmount = (_amount * commisson) / 100;
        uint256 _amountToWithdraw = _amount - _commissonAmount;

        payable(_account.owner).transfer(_amountToWithdraw);
        payable(contractOwner).transfer(_commissonAmount);

        uint256 _newBalance = _account.amount - _amountToWithdraw;
        _account.amount = _newBalance;
        emit newWithdraw(_amount, _account.amount, _account.owner, _account.accountName);
    }

    function createAccount(
        string memory _accountName,
        string memory _accountDescription,
        uint _accountId
        ) public returns (bool) {

            accounts[_accountId] = Account(
                payable(msg.sender),
                _accountName,
                _accountDescription,
                0,
                0,
                _accountId
            );

            totalAccount++;

        return true;
    }

    function lockAccount(uint _accountId, uint256 _timestamp) public{
        require(block.timestamp < _timestamp, "lock time should be in the future");
        Account storage _account = accounts[_accountId];
        _account.lockTime = _timestamp;
        emit locked(_account);
    }

    function deleteAccount(uint _accountId) public onlyAccountOwner(_accountId) returns (bool) {
        Account storage _account = accounts[_accountId];

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

    function getBankBalance() public onlyContractOwner view returns(uint256){
        require(msg.sender == contractOwner, "only the contract");
        return address(this).balance;
    }
}

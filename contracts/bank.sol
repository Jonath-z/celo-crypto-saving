// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

interface IERC20Token {
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
}

contract Bank {

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    uint public totalAccount = 0;

    struct Account{
        address payable owner;
        string accountName;
        string description;
        uint256 amount;
        uint lockTime;
        uint accountId;
    }

    mapping(uint => Account) public accounts;

    event newDeposit (uint256 amount, uint time, address owner, string accountName);

    modifier onlyOwner(uint _accountId){
        require(getAccount(_accountId).owner == msg.sender);
        _;
    }

    function getAccount(uint _accountId) internal view returns (Account memory _account) {
        return (accounts[_accountId]);
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

        require(_account.amount > _amount, "Don't enought found");

        IERC20Token(cUsdTokenAddress).transfer(_account.owner, _amount);

        uint256 _newBalance = _account.amount - _amount;
        
        _account.amount = _newBalance;
    }

    function createAccount(
        string memory _accountName,
        string memory _accountDescription,
        uint _locktime,
        uint _accountId,
        address _owner
        ) public {

            accounts[_accountId] = Account(
                payable(_owner),
                _accountName,
                _accountDescription,
                0,
                _locktime,
                _accountId
            );

            totalAccount++;
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
}
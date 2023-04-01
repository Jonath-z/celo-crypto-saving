// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {
    address payable public contractOwner;
    uint256 public totalAccount = 0;
    uint256 public commission = 0;  // in pourcentage

    constructor(address payable _contractOwner) {
        contractOwner = _contractOwner;
    }

    struct Account {
        address payable owner;
        string accountName;
        string description;
        uint256 amount;
        uint256 lockTime;
        uint accountId;
    }

    mapping(uint => Account) public accounts;

    event newDeposit(
        uint256 amount,
        uint time,
        address owner,
        string accountName
    );

    event newWithdraw(
        uint256 amount,
        uint256 newBalance,
        address owner,
        string accoutName
    );
    event locked(Account account);

    /**
     * Modifier assuring the access to only the account owner
     * @param _accountId - The account id
     */
    modifier onlyAccountOwner(uint _accountId) {
        require(accounts[_accountId].owner == msg.sender);
        _;
    }
    
    /**
     * Modifier assuring the access to only the contract owner
     */
    modifier onlyContractOwner() {
        require(msg.sender == contractOwner);
        _;
    }


    /**
     * Check if the lock time expires and returns true if it is and otherwise returns false
     * @param _accountId - the account id
     */
    function lockTimeExpired(uint _accountId) internal view returns (bool) {
        Account memory _account = accounts[_accountId];
        if (block.timestamp >= _account.lockTime) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Make deposit into an account
     * @param _accountId - Account id in which the deposit will be made
     */
    function deposit(uint _accountId) public payable {
        // Get the account Address that is making the deposit.
        address _depositAddress = payable(msg.sender);

        // Get the amount to save.
        uint256 _amount = msg.value;

        // Get the account in which the deposit will be made.
        Account storage _account = accounts[_accountId];

        // Calculate the new balance of the account.
        uint256 _newBalance = _account.amount + _amount;

        // Update the account amount to the new balance.
        _account.amount = _newBalance;

        // Emit the new deposit event.
        emit newDeposit(
            _amount,
            _account.lockTime,
            _depositAddress,
            _account.accountName
        );
    }

    /**
     * Perform a widthraw. 
     * Can only be called by the account owner.
     * @param _accountId - The account from which the withdrawal will be made.
     * @param _amount - The amount to withdraw.
     */
    function withdraw(
        uint _accountId,
        uint256 _amount
    ) public payable onlyAccountOwner(_accountId) {
        // Get the account from which the withdraw will be made.
        Account storage _account = accounts[_accountId];

        // Check if the account balance is greater than the amount to withdraw.
        require(_account.amount > _amount, "Don't have enought found");

        // Check if the account is not locked
        require(
            lockTimeExpired(_accountId),
            "Can not withdraw, account is still locked"
        );

        // Calulate the commission amount.
        uint256 _commissionAmount = (_amount * commission) / 100;

        // Calculate the amount to withdraw.
        uint256 _amountToWithdraw = _amount - _commissionAmount;

        // Send the amount to withdraw to the account owner.
        payable(_account.owner).transfer(_amountToWithdraw);

        // Send the commission to the contract owner.
        payable(contractOwner).transfer(_commissionAmount);

        // Calculate the new balance.
        uint256 _newBalance = _account.amount - _amountToWithdraw;
        
        // Update the account balance
        _account.amount = _newBalance;

        // Emit the withdraw Event
        emit newWithdraw(
            _amount,
            _account.amount,
            _account.owner,
            _account.accountName
        );
    }

    /**
     * @param _accountName - The name of the account 
     * @param _accountDescription - The description of the account
     * @param _accountId - The account id
     * @return true
     */
    function createAccount(
        string memory _accountName,
        string memory _accountDescription,
        uint _accountId
    ) public returns (bool) {
        // Create the account Structure and add it the mapping
        accounts[_accountId] = Account(
            payable(msg.sender),
            _accountName,
            _accountDescription,
            0,
            0,
            _accountId
        );

        // Increment the number if the accounts created
        totalAccount++;

        return true;
    }

    /**
     * @param _accountId - The account id of the account that will be locked
     * @param _timestamp - The lock time 
     */
    function lockAccount(uint _accountId, uint256 _timestamp) public {
        require(
            block.timestamp < _timestamp,
            "lock time should be in the future"
        );
        // Get the account to lock.
        Account storage _account = accounts[_accountId];
        
        // Update the lock time.
        _account.lockTime = _timestamp;

        // Emit the lock event.
        emit locked(_account);
    }

    /**
     * @param _accountId - The id if the account to delete.
     * @return deleted
     */
    function deleteAccount(
        uint _accountId
    ) public onlyAccountOwner(_accountId) returns (bool deleted) {
        // Get the account to delete.
        Account storage _account = accounts[_accountId];
        
        // Check if the account balance is 0.
        require(_account.amount == 0, "Can not delete an account with found");

        // Delete the account.
        delete accounts[_accountId];

        // Decrement the number of the account created.
        totalAccount--;

        return deleted = true;
    }

    /**
     * The value passed as the commisson is considered in pourcentage
     * @param newCommission - New commission value
     */
    function updateCommission(uint256 newCommission) public onlyContractOwner {
        commission = newCommission;
    }

    /**
     * @return {Address} - the contract owner address
     */
    function getContractOwner() public view returns (address) {
        return contractOwner;
    }

    /**
     * @param _accountId - The account id to get
     */
    function getAccount(
        uint _accountId
    ) public view returns (Account memory _account) {
        return (accounts[_accountId]);
    }

    // Get the bank balance
    function getBankBalance() public view onlyContractOwner returns (uint256) {
        return address(this).balance;
    }
}

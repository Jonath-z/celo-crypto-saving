// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {
    struct Account {
        address payable owner;
        string accountName;
        string description;
        uint256 amount;
        uint256 lockTime;
        uint accountId;
    }

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

    mapping(uint => Account) public accounts;

    address payable public immutable i_contractOwner;
    uint256 public s_totalAccount;
    uint256 public s_commission;  // in pourcentage


    constructor() {
        i_contractOwner = payable(msg.sender);
    }

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
        require(msg.sender == i_contractOwner);
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
     * @param _accountName - The name of the account 
     * @param _accountDescription - The description of the account
     * @return true
     */
    function createAccount(
        string memory _accountName,
        string memory _accountDescription
    ) public returns (bool) {
        s_totalAccount++;
        // Create the account Structure and add it the mapping
        accounts[s_totalAccount] = Account(
            payable(msg.sender),
            _accountName,
            _accountDescription,
            0,
            0,
            s_totalAccount
        );
        return true;
    }

    /**
     * Make deposit into an account
     * @param _accountId - Account id in which the deposit will be made
     */
    function deposit(uint _accountId) public payable {
        require(msg.value > 0, "Not enough funds to make a deposit");
        // Get the account in which the deposit will be made.
        Account storage _account = accounts[_accountId];
        // Update the account amount to the new balance.
        _account.amount += msg.value;
        // Emit the new deposit event.
        emit newDeposit(
            msg.value,
            _account.lockTime,
            _account.owner,
            _account.accountName
        );
    }

    /**
     * Perform a widthraw. 
     * Can only be called by the account owner.
     * @param _accountId - The account from which the withdrawal will be made.
     * @param _amountToWithdraw - The amount to withdraw.
     */
    function withdraw(
        uint _accountId,
        uint256 _amountToWithdraw
    ) public payable onlyAccountOwner(_accountId) {
        // Get the account from which the withdraw will be made.
        Account storage _account = accounts[_accountId];

        // Check if the account is not locked
        require(
            lockTimeExpired(_accountId),
            "Can not withdraw, the account is locked"
        );
        // Calulate the commission amount.
        uint256 _commissionAmount = (_amountToWithdraw * s_commission) / 100;
        require(_account.amount > (_commissionAmount + _amountToWithdraw), "Not have enough funds to withdraw");
        // Update the account balance
        _account.amount -= (_amountToWithdraw + _commissionAmount);
        // Send the amount to withdraw to the account owner.
        payable(_account.owner).transfer(_amountToWithdraw);
        // Send the commission to the contract owner.
        payable(i_contractOwner).transfer(_commissionAmount);
        // Emit the withdraw Event
        emit newWithdraw(
            _amountToWithdraw,
            _account.amount,
            _account.owner,
            _account.accountName
        );
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
        _account.lockTime = block.timestamp + _timestamp;

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
        // Check if the account balance is 0.
        require(accounts[_accountId].amount == 0, "Can not delete an account with found");
        delete accounts[_accountId];
        s_totalAccount--;
        return deleted = true;
    }

    /**
     * The value passed as the commisson is considered in pourcentage
     * @param newCommission - New commission value
     */
    function updateCommission(uint256 newCommission) public onlyContractOwner {
        s_commission = newCommission;
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

const { expect } = require("chai");
const { ethers } = require("hardhat");
const moment = require("moment");

const TEST_ACCOUNT_ID = 2390;

describe("Bank", function () {
  let bank, bank_owner;

  before(async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const Bank = await ethers.getContractFactory("Bank");
    bank = await Bank.deploy(owner.address);
    bank_owner = owner.address;
  });

  it("Should set the contract owner", async function () {
    const contractOwner = await bank.getContractOwner();
    expect(bank_owner).to.be.equal(contractOwner);
  });

  it("Should create & get the account", async function () {
    const account = {
      accountName: "Celo Bank",
      description: "Safe and decentralized bank",
      accountId: TEST_ACCOUNT_ID,
    };
    await bank.createAccount(
      account.accountName,
      account.description,
      account.accountId
    );
    const accountCreated = await bank.getAccount(TEST_ACCOUNT_ID);

    expect(accountCreated.owner).to.equal(bank_owner);
    expect(accountCreated.name).to.equal(account.name);
    expect(accountCreated.description).to.equal(account.description);
    expect(accountCreated.amount).to.equal(0);
    expect(accountCreated.accountId).to.equal(account.accountId);
    expect(accountCreated.lockTime).to.equal(0);
  });

  it("Should make a deposit", async function () {
    const depositAmount = ethers.utils.parseEther("1");

    // deposit requires the account id and the the value to deposit
    const depositTx = await bank.deposit(TEST_ACCOUNT_ID, {
      value: depositAmount,
    });
    const txReceipt = await depositTx.wait();

    expect(depositAmount).to.equal(txReceipt.events[0].args[0]);
  });

  it("Should get bank balance", async function () {
    const depositedAmount = ethers.utils.parseEther("1");
    const balance = await bank.getBankBalance();
    expect(depositedAmount).to.be.equal(balance);
  });

  it("Should withdraw", async function () {
    const amountToWithdraw = ethers.utils.parseEther("0.2");

    // withdraw function requires the account Id and the amount to withdraw
    const withdrawTx = await bank.withdraw(TEST_ACCOUNT_ID, amountToWithdraw);
    const txReceipt = await withdrawTx.wait();

    expect(txReceipt.events[0].args[0]).to.be.equal(amountToWithdraw);
    expect(txReceipt.events[0].args[1]).to.be.equal(
      ethers.utils.parseEther("0.8")
    );
  });

  it("Should lock the account successfully", async function () {
    const lockTimstamp = moment().add(5, "minutes").valueOf();

    // lockAccount requires the account id and the lock timestamp in second
    const lock = await bank.lockAccount(TEST_ACCOUNT_ID, lockTimstamp);
    const txLock = await lock.wait();
    expect(lockTimstamp).to.equal(txLock.events[0].args[0].lockTime);
  });

  it("Should delete the account", async function () {
    await bank.deleteAccount(TEST_ACCOUNT_ID);
  });
});

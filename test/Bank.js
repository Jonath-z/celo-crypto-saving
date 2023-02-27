const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");
const BigNumber = require("bignumber.js");

describe("Bank", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy(owner.address);

    return { bank, owner, otherAccount };
  }

  it("Should set the contract owner", async function () {
    const { bank, owner } = await deploy();
    const contractOwner = await bank.getContractOwner();
    expect(owner.address).to.be.equal(contractOwner);
  });

  it("Should create an account", async function () {
    const { bank, owner } = await deploy();
    const lockTimeBigNumber = new Date(2023, 2, 27, 13, 30, 0).getTime();

    const account = {
      owner: owner.address,
      accountName: "Celo Bank",
      description: "Safe and decentralized bank",
      amount: 0,
      lockTime: lockTimeBigNumber,
      accountId: 2390,
    };
    /* 
     create account requires
     params: accountName, accountDescription, AccountId
     returns true
    */
    await bank.createAccount(
      account.accountName,
      account.description,
      account.lockTime,
      account.accountId
    );

    /* getAccount requires the accountId */
    const accountCreated = await bank.getAccount(2390);

    expect(accountCreated.owner).to.equal(account.owner);
    expect(accountCreated.name).to.equal(account.name);
    expect(accountCreated.description).to.equal(account.description);
    expect(accountCreated.amount).to.equal(account.amount);
    expect(accountCreated.id).to.equal(account.id);
    expect(accountCreated.lockTime).to.equal(account.lockTime);
  });
});

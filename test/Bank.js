const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
  async function deploy() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy(process.env.CONTRACT_OWNER);

    return { bank, owner, otherAccount };
  }

  it("Should set the contract owner", async function () {
    const { bank } = await deploy();
    const contractOwner = await bank.getContractOwner();
    expect(process.env.CONTRACT_OWNER).to.be.equal(contractOwner);
  });

  it("Should create an account", async function () {
    const { bank } = await deploy();
    const account = {
      owner: process.env.CONTRACT_OWNER,
      accountName: "Celo Bank",
      description: "Safe and decentralized bank",
      amount: 0,
      lockTime: new Date(2023, 2, 27, 13, 30, 0),
      accountId: 2390,
    };
    /* 
     create account requires
     params: accountName, accountDescription, AccountId
     returns true
    */
    const accountCreatedStatus = await bank.createAccount(
      account.accountName,
      account.description,
      account.lockTime,
      account.accountId
    );

    /* getAccount requires the accountId */
    const accountCreated = await bank.getAccount(2390, {
      value: process.env.CONTRACT_OWNER,
    });

    expect(accountCreatedStatus).to.be(true);
    expect(accountCreated).to.deep(account);
  });
});

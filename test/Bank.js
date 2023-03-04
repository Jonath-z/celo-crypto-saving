const { expect } = require("chai");
const { ethers } = require("hardhat");

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
      accountId: 2390,
    };
    await bank.createAccount(
      account.accountName,
      account.description,
      account.accountId
    );
    const accountCreated = await bank.getAccount(2390);

    expect(accountCreated.owner).to.equal(bank_owner);
    expect(accountCreated.name).to.equal(account.name);
    expect(accountCreated.description).to.equal(account.description);
    expect(accountCreated.amount).to.equal(0);
    expect(accountCreated.accountId).to.equal(account.accountId);
    expect(accountCreated.lockTime).to.equal(0);
  });

  it("Should make a deposit", async function () {
    const depositAmount = ethers.utils.parseEther("1");
    const depositReceipt = await bank.deposit(depositAmount, 2390);

    const txReceipt = await depositReceipt.wait();
    expect(depositAmount).to.equal(txReceipt.events[0].args[0]);
  });
});

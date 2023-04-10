import { expect } from "chai";
import { ethers } from "hardhat";
import { Bank } from "../types";
import moment from "moment";

async function createAccount(bank: Bank) {
  const account = {
    accountName: "Celo Bank",
    description: "Safe and decentralized bank",
  };
  await bank.createAccount(account.accountName, account.description);
  const accountCreated = await bank.getAccount(1);
  return { accountCreated, account };
}

describe("Bank", async function () {
  let bank: Bank, bank_owner: string;

  before(async function () {
    const [owner, otherAccount] = await ethers.getSigners();
    const bankContract = await ethers.getContractFactory("Bank");
    bank = (await bankContract.deploy()) as Bank;
    bank_owner = owner.address;
  });

  it("Should set the contract owner", async function () {
    const contractOwner = await bank.i_contractOwner();
    expect(bank_owner).to.be.equal(contractOwner);
  });

  it("Should get the total account number", async function () {
    const totalAccounts = await bank.s_totalAccount();
    expect(totalAccounts).to.be.equal(0);
  });

  it("Should create & get the account", async function () {
    const { accountCreated, account } = await createAccount(bank);
    expect(accountCreated.owner).to.equal(bank_owner);
    expect(accountCreated.accountName).to.equal(account.accountName);
    expect(accountCreated.description).to.equal(account.description);
    expect(accountCreated.amount).to.equal(0);
    expect(accountCreated.accountId).to.equal(1);
    expect(accountCreated.lockTime).to.equal(0);
  });

  it("Should delete the account", async function () {
    await bank.deleteAccount(1);
    const totalAccount = await bank.s_totalAccount();
    expect(totalAccount).to.be.equal(0);
  });

  it("Should make a deposit", async function () {
    await createAccount(bank);
    const depositAmount = ethers.utils.parseEther("10");

    // deposit requires the account id and the the value to deposit
    const depositTx = await bank.deposit(1, {
      value: depositAmount,
    });
    const txReceipt = await depositTx.wait();
    expect(depositAmount).to.equal(txReceipt.events?.at(0)?.args?.at(0));
  });

  it("Should get bank balance", async function () {
    const depositedAmount = ethers.utils.parseEther("10");
    const balance = await bank.getBankBalance();
    expect(depositedAmount).to.be.equal(balance);
  });

  it("Should set the commission", async function () {
    const commission = 5; // 5%
    await bank.updateCommission(commission);
    const newCommission = await bank.s_commission();
    expect(newCommission).to.be.equal(commission);
  });

  it("Should withdraw", async function () {
    const amountToWithdraw = ethers.utils.parseEther("2");
    const commission = await bank.s_commission();
    // calculate commissionAmount
    // (commisson * amountToWithdraw) / 100
    const commissionAmount =
      (Number(commission) * Number(amountToWithdraw)) / 100;
    const acccountAmount = (await bank.getAccount(1)).amount;
    // calculate the current account balance
    const currentAccountBalance =
      Number(acccountAmount) - (commissionAmount + Number(amountToWithdraw));
    // withdraw function requires the account Id and the amount to withdraw
    const withdrawTx = await bank.withdraw(1, amountToWithdraw);
    const txReceipt = await withdrawTx.wait();
    expect(txReceipt.events?.at(0)?.args?.at(1)).to.be.equal(
      BigInt(currentAccountBalance)
    );
  });

  it("Should lock the account successfully", async function () {
    const lockTimstamp = moment().add(5, "minutes").valueOf();
    // lockAccount requires the account id and the lock timestamp in second
    const lock = await bank.lockAccount(1, lockTimstamp);
    const txLock = await lock.wait();
    expect(txLock.events?.at(0)?.args?.at(0).lockTime).to.greaterThan(
      lockTimstamp
    );
  });
});

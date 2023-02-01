const { accounts, contract } = require("@openzeppelin/test-environment");
const { expect } = require("chai");
const [deployer, _] = accounts;

const celoBank = contract.fromArtifact("Bank");

describe("Bank contract test", function () {
  beforeEach(async function () {
    this.contract = await celoBank.new({ from: deployer });
  });

  it("should create an account and get the account", async function () {
    const accountName = "default account";
    const accountDescription = "account description";
    const lockTime = 3600;
    const accountId = "uint-100-9394-23094-499-293-9493";

    const createAccountResult = await this.contract.createAccount(
      accountName,
      accountDescription,
      lockTime,
      accountId,
      { from: deployer }
    );

    const expectedAccount = {
      owner: deployer,
      accountName,
      description: accountDescription,
      amount: 0,
      lockTime,
      accountId,
    };

    const account = await this.contract.getAccount(accountId);

    console.log({ account });

    expect(createAccountResult.receipt.status).toBe(true);
    expect(account).toStrictEqual(expectedAccount);
  });

  it("should make a deposit", async function () {
    const accountId = "uint-100-9394-23094-499-293-9493";

    await this.contract.deposit(10, accountId, { from: deployer });

    const account = await this.contract.getAccount(accountId);

    expect(account.amount).toBe(10);
  });
});

import hre from "hardhat";
async function main() {
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy();
  await bank.deployed();

  console.log("Contract deployed successfully", { address: bank.address });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

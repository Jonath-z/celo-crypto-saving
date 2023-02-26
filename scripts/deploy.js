const hre = require("hardhat");
const CONTRACT_DEPLOYER = process.env.CONTRACT_OWNER;

async function main() {
  const Bank = await hre.ethers.getContractFactory("Bank");
  const bank = await Bank.deploy(CONTRACT_DEPLOYER);
  await bank.deployed();

  console.log("Contract deployed successfully");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

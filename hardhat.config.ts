import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
  solidity: "0.8.17",
  typechain: {
    outDir: "types",
    target: "ethers-v5",
  },
};

export default config;

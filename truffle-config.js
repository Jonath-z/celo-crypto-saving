module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000,
    },
    celo_test_net: {
      host: "",
      port: 0,
      network_id: "*",
      gas: 5000000,
    },
  },
  compilers: {
    solc: {
      version: ">=0.7.0 <0.9.0",
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200, // Default: 200
        },
      },
    },
  },
};

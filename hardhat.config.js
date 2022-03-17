require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },

  defaultNetwork: 'matic',
  networks: {
    hardhat: {},
    matic: {
      url : 'https://speedy-nodes-nyc.moralis.io/defd019df2c0685181b50e9a/polygon/mumbai',
      accounts : ['d33f9159f5d75077b27bb4a2298d82d261a42f1ffb1ad4674f32318802784cd2'], //private key of account
    },
  },

  // defaultNetwork: "ganache",
  // networks: {
  //   hardhat: {
  //   },
  //   ganache: {
  //     url: "HTTP://127.0.0.1:8545",
  //   }
  // },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 400000000
  }
};

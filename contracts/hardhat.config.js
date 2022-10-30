require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      url: "https://goerli.infura.io/v3/496baede9f4e43268e0f838b8fe586da",
      accounts: [
        "789b9cf1953cbd54d6872fa7179de53cf863535381fd75a770f29c50bed2802f",
      ],
    },
  },
  etherscan: {
    apiKey: "MXEI49CNKBAJZKYCCKUW2YSVR4X7B1VV8R",
  },
  solidity: "0.8.17",
};

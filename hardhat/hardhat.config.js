require('@nomiclabs/hardhat-waffle')

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const GOERLY_PRIVATE_KEY = process.env.GOERLY_PRIVATE_KEY

module.exports = {
  solidity: '0.8.4',
  mocha: {
    timeout: 100000000,
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${GOERLY_PRIVATE_KEY}`],
    },
  },
}

// const bn = require("bn.js");
// const HDWalletProvider = require("@truffle/hdwallet-provider");
// const Network = require("@maticnetwork/meta/network");
// const Matic = require("@maticnetwork/maticjs").default;
// console.log(Matic)
// const SCALING_FACTOR = new bn(10).pow(new bn(18));

const private_key = 'd33f9159f5d75077b27bb4a2298d82d261a42f1ffb1ad4674f32318802784cd2'
const from = '0xFb1B0A9B9d71D9a8A44B8964874897d1992A5034'
// // const { from } = getAccount();
// async function getMaticClient(_network = "testnet", _version = "mumbai") {
//   const network = new Network(_network, _version);
//   const matic = new Matic({
//     network: _network,
//     version: _version,
//     parentProvider: new HDWalletProvider(
//       private_key,
//       'https://goerli.infura.io/v3/2b1eac7434014a04b279e24da8abc275'//network.Main.RPC
//     ),
//     maticProvider: new HDWalletProvider(
//       private_key,
//       "https://rpc-mumbai.maticvigil.com/v1/5b25ffdb9cf0cce0756c6b8456429619b3d03c91"//network.Matic.RPC
//     ),
//     parentDefaultOptions: { from },
//     maticDefaultOptions: { from },
//   });
//   await matic.initialize();
//   return { matic, network };
// }

function getAccount() {
  if (!private_key) {
    throw new Error("Please set the PRIVATE_KEY");
  }
  return { privateKey: private_key, from };
}

// module.exports = {
//   SCALING_FACTOR,
//   getMaticClient,
//   getAccount,
// };

// const use = require('@maticnetwork/maticjs').use
const { Web3ClientPlugin } = require('@maticnetwork/maticjs-web3')
const { PlasmaClient } = require('@maticnetwork/maticjs-plasma')
const { use } = require('@maticnetwork/maticjs')
const HDWalletProvider = require('@truffle/hdwallet-provider')

// install web3 plugin
use(Web3ClientPlugin)


async function getPlasmaClient (network = 'testnet', version = 'mumbai') {
  try {
    const plasmaClient = new PlasmaClient()
    return plasmaClient.init({
      network: network,
      version: version,
      parent: { //https://speedy-nodes-nyc.moralis.io/defd019df2c0685181b50e9a/polygon/mumbai
        provider: new HDWalletProvider(private_key, 'https://goerli.infura.io/v3/2b1eac7434014a04b279e24da8abc275'),
        defaultConfig: {
          from
        }
      },
      child: {
        provider: new HDWalletProvider(private_key, 'https://rpc-mumbai.maticvigil.com/v1/5b25ffdb9cf0cce0756c6b8456429619b3d03c91'),
        defaultConfig: {
          from
        }
      }
    })
  } catch (error) {
    console.error('error unable to initiate plasmaClient', error)
  }
}
module.exports = {
  // SCALING_FACTOR,
  getPlasmaClient,
  getAccount,
};
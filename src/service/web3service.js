//import { Web3Auth } from "@web3auth/modal";
//import Web3 from "web3";

const Web3 = require('web3');
const Web3Auth = require('@web3auth/modal');

const web3auth = new Web3Auth({
    clientId: "BEHkRFATS75PnRVgFwcJdELb7OwEIzCuWQ3tXs6u_v0hZFzGY83wJxhU78uvrKWqY1JWdUPnoTWNFosMiUW6hv8", // get it from Web3Auth Dashboard
    chainConfig: {
      chainNamespace: "eip155",
      chainId: "0x61", // hex of 97
      rpcTarget: "https://rpc.ankr.com/bsc_testnet_chapel",
      // Avoid using public rpcTarget in production.
      // Use services like Infura, Quicknode etc
      displayName: "Binance SmartChain Testnet",
      blockExplorer: "https://testnet.bscscan.com",
      ticker: "BNB",
      tickerName: "BNB",
    },
  });
await web3auth.initModal();

const web3authProvider = web3auth.connect();

const web3 = new Web3(web3authProvider); // web3auth.provider

const user = await web3auth.getUserInfo();

module.exports = {
    user
  }
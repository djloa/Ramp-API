

const Web3 = require('web3');
const Common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx')
require('dotenv').config()


module.exports = async function (address, amount) {
  const abiJson = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdrawEther", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "unfreeze", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "freezeOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "freeze", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "initialSupply", "type": "uint256" }, { "name": "tokenName", "type": "string" }, { "name": "decimalUnits", "type": "uint8" }, { "name": "tokenSymbol", "type": "string" }], "payable": false, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Freeze", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Unfreeze", "type": "event" }];
  web3 = (new Web3(new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s3.binance.org:8545`)))

  const bnbContractAdress = "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";

  const contract = new web3.eth.Contract(abiJson, bnbContractAdress)
  let sender = "0xfFc53ba77AA5FD6bA432Ae10f0b50d196fB89559"
  let receiver = address;
  let senderkey = Buffer.from(process.env.SENDER_PRIVATE_KEY, "hex")

  let data = await contract.methods.transfer(receiver, web3.utils.toHex(10000000)) //change this value to change amount to send according to decimals
  let nonce = await web3.eth.getTransactionCount(sender) //to get nonce of sender address

  var originalAmountToBuyWith = amount.toString();
  var bnbAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

  let rawTransaction = {
      "from": sender,
      "gasPrice": web3.utils.toHex(parseInt(Math.pow(10, 9) * 12)), //5 gwei
      "gasLimit": web3.utils.toHex(50000), //500,000 gas limit
      "to": receiver, //interacting with bnb contract
      "value": web3.utils.toHex(web3.utils.toHex(bnbAmount)),
      "data": data.encodeABI(), //our transfer data from contract instance
      "nonce": web3.utils.toHex(nonce)
  };

  const common1 = Common.default.forCustomChain(
      'ropsten',
      {
          name: 'Binance Smart Chain Testnet',
          networkId: 97,
          chainId: 97,
          url: 'https://data-seed-prebsc-1-s1.binance.org:8545'
      },
      'istanbul',
  );// declaring that our tx is on a custom chain, bsc chain

  let transaction = new Tx.Transaction(rawTransaction, {
      common: common1
  }); //creating the transaction

  transaction.sign(senderkey); //signing the transaction with private key

  let result = await web3.eth.sendSignedTransaction(`0x${transaction.serialize().toString('hex')}`) //sending the signed transaction
  console.log(`Txstatus: ${result.status}`) //return true/false
  console.log(`Txhash: ${result.transactionHash}`) //return transaction hash
  console.log("result: " + JSON.stringify(result)) //return result json
  return result;

}
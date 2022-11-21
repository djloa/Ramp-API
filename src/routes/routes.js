// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';


const Web3 = require("web3");
const Common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx')

//eth
async function main() {
    // Configuring the connection to an Ethereum node
    const network = 'goerli'
    const web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/25fbdd86af9246749c3613fb239f6c8f`
        )
    );
    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        'e8eb5efec013e3ca5839ee408a8dd86f6d034fd6acc34b46082f483f6f68f989'
    );
    web3.eth.accounts.wallet.add(signer);

    // Estimatic the gas limit
    var limit = web3.eth.estimateGas({
        from: signer.address,
        to: "0xF7508d044d21169927dE87aa358E79b9E17561c9",
        value: web3.utils.toWei("0.001")
    }).then(console.log);

    // Creating the transaction object
    const tx = {
        from: signer.address,
        to: "0xF7508d044d21169927dE87aa358E79b9E17561c9",
        value: web3.utils.numberToHex(web3.utils.toWei('0.01', 'ether')),
        gas: web3.utils.toHex(limit),
        nonce: web3.eth.getTransactionCount(signer.address),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
        chainId: 5,
        type: 0x2
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
    console.log("Raw transaction data: " + signedTx.rawTransaction)

    // Sending the transaction to the network
    const receipt = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });
    // The transaction is now on chain!
    console.log(`Mined in block ${receipt.blockNumber}`);
    console.log("receipt " + JSON.stringify(receipt));


}

//BNB
async function main2() {
    const abiJson = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdrawEther", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "burn", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "unfreeze", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "freezeOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_value", "type": "uint256" }], "name": "freeze", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "initialSupply", "type": "uint256" }, { "name": "tokenName", "type": "string" }, { "name": "decimalUnits", "type": "uint8" }, { "name": "tokenSymbol", "type": "string" }], "payable": false, "type": "constructor" }, { "payable": true, "type": "fallback" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Burn", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Freeze", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Unfreeze", "type": "event" }];
    const web3 = (new Web3(new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s3.binance.org:8545`)))

    const busd = "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";

    const contract = new web3.eth.Contract(abiJson, busd)
    let sender = "0xfFc53ba77AA5FD6bA432Ae10f0b50d196fB89559"
    let receiver = "0xF7508d044d21169927dE87aa358E79b9E17561c9"
    let senderkey = Buffer.from("e8eb5efec013e3ca5839ee408a8dd86f6d034fd6acc34b46082f483f6f68f989", "hex")

    let data = await contract.methods.transfer(receiver, web3.utils.toHex(10000000)) //change this value to change amount to send according to decimals
    let nonce = await web3.eth.getTransactionCount(sender) //to get nonce of sender address

    let chain = {

        "name": "tBNB",
        "networkId": 97,
        "chainId": 97
    }

    var originalAmountToBuyWith = '0.017' + Math.random().toString().slice(2,7);
    var bnbAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');

    let rawTransaction = {
        "from": sender,
        "gasPrice": web3.utils.toHex(parseInt(Math.pow(10, 9) * 12)), //5 gwei
        "gasLimit": web3.utils.toHex(50000), //500,000 gas limit
        "to": receiver, //interacting with busd contract
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

}


const RampOrder = require('../model/ramporder');


module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return "<h1> Hello World!</h1>";
    }
},
{
    method: 'POST',
    path: '/fulfill-order',
    handler: async (request, h) => {
        try {
            const rampOrder = new RampOrder({
                date: Date.now(),
                amount: request.payload.cryptoUnitCount,
                wallet: request.payload.walletAddress,
                currencyName: request.payload.cryptoCurrencyName,
                status: 'COMPLETE'

            });

            const rampSaved = await rampOrder.save();
            const result = {
                success: true,
                message: rampSaved,
                data: {}
            }
            return h.response(result).code(200)
        } catch (error) {
            console.log(error);
            return h.response(error).code(500);
        }

    }
},
{
    method: 'GET',
    path: '/findOrders',
    handler: async (request, h) => {
        try {
            main2()
            const result = await RampOrder.find({});
            return h.response(result).code(200)
        } catch (error) {
            console.log(error)
            return h.response(error).code(500);
        }

    }
},
];

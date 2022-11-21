// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';


const Web3 = require("web3");
const web3 = (new Web3(new Web3.providers.HttpProvider(`https://bsctestapi.terminet.io/rpc`)))
const Common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx')

async function main() {
    const busd = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56";

    const tokenABI = [
        // balanceOf
        { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
        // decimals 
        { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" },
        // transfer
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "type": "function"
        }
    ];

    const contract = new web3.eth.Contract(tokenABI, busd)
    let sender = "0xfFc53ba77AA5FD6bA432Ae10f0b50d196fB89559"
    let receiver = "0xF7508d044d21169927dE87aa358E79b9E17561c9"
    let senderkey = Buffer.from("e8eb5efec013e3ca5839ee408a8dd86f6d034fd6acc34b46082f483f6f68f989", "hex")

    let data = await contract.methods.transfer(receiver, web3.utils.toHex(10000000000000)) //change this value to change amount to send according to decimals
    let nonce = await web3.eth.getTransactionCount(sender) //to get nonce of sender address

    let chain = {

        "name": "bnb",
        "networkId": 97,
        "chainId": 97
    }

    let rawTransaction = {
        "chanId": 97,
        "from": sender,
        "gasPrice": web3.utils.toHex(parseInt(Math.pow(10, 9) * 5)), //5 gwei
        "gasLimit": web3.utils.toHex(500000), //500,000 gas limit
        "to": busd, //interacting with busd contract
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
    ) // declaring that our tx is on a custom chain, bsc chain

    let transaction = new Tx.Transaction(rawTransaction, {
        common: common1
    }); //creating the transaction


    let result = await web3.eth.sendSignedTransaction(`0x${transaction.serialize().toString('hex')}`) //sending the signed transaction
    console.log(`Txstatus: ${result.status}`) //return true/false
    console.log(`Txhash: ${result.transactionHash}`) //return transaction hash
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
            main()
            const result = await RampOrder.find({});
            return h.response(result).code(200)
        } catch (error) {
            console.log(error)
            return h.response(error).code(500);
        }

    }
},
];

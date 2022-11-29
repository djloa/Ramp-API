

const Web3 = require('web3');
const Common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx')
require('dotenv').config()


module.exports = async function (address, amount) {
    web3 = (new Web3(new Web3.providers.HttpProvider(`https://data-seed-prebsc-1-s3.binance.org:8545`)))
    //wallet validation
    if (!web3.utils.isAddress(address)) return false;

    //wallet validation
    if (!web3.utils.isAddress(address)) return false;

    let sender = "0xF7508d044d21169927dE87aa358E79b9E17561c9"
    let receiver = address;
    let senderkey = Buffer.from(process.env.SENDER_PRIVATE_KEY, "hex")

    let nonce = await web3.eth.getTransactionCount(sender) //to get nonce of sender address

    var originalAmountToBuyWith = amount.toString();
    var bnbAmount = web3.utils.toWei(originalAmountToBuyWith, 'ether');


    // Estimatic the gas limit
    var gasLimit = web3.eth.estimateGas({
        from: address,
        to: address
    }).then(console.log);


    let rawTransaction = {
        "from": sender,
        "gasPrice": web3.utils.toHex(parseInt(Math.pow(10, 9) * 12)), //12 gwei
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": receiver, //wallet address
        "value": web3.utils.toHex(web3.utils.toHex(bnbAmount)),
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
    console.log(`Txhash: ${result.transactionHash}`) //return transaction hash
    return result;

}
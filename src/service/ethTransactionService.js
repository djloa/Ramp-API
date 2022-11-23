

const Web3 = require('web3');


module.exports = async function (address, amount) {
    // Configuring the connection to an Ethereum node
    const network = 'goerli'
    web3 = new Web3(
        new Web3.providers.HttpProvider(
            `https://${network}.infura.io/v3/25fbdd86af9246749c3613fb239f6c8f`
        )
    );
    // Creating a signing account from a private key
    const signer = web3.eth.accounts.privateKeyToAccount(
        process.env.SENDER_PRIVATE_KEY
    );
    web3.eth.accounts.wallet.add(signer);

    // Estimatic the gas limit
    var limit = web3.eth.estimateGas({
        from: signer.address,
        to: address,
        value: web3.utils.toWei("0.001")
    }).then(console.log);

    console.log('limit: ' + limit);

    // Creating the transaction object
    const tx = {
        from: signer.address,
        to: address,
        value: web3.utils.numberToHex(web3.utils.toWei(amount.toString(), 'ether')),
        gas: web3.utils.toHex(limit),
        nonce: web3.eth.getTransactionCount(signer.address),
        maxPriorityFeePerGas: web3.utils.toHex(web3.utils.toWei('2', 'gwei')),
        chainId: 5,
        type: 0x2
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, signer.privateKey)
    console.log("Raw transaction data: " + signedTx.rawTransaction)

    // Sending the transaction to the network
    const result = await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .once("transactionHash", (txhash) => {
            console.log(`Mining transaction ...`);
            console.log(`https://${network}.etherscan.io/tx/${txhash}`);
        });
    // The transaction is now on chain!
    console.log("receipt " + JSON.stringify(result));
    return result;


}
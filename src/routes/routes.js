// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';


const bnbTransaction = require('../service/bnbTransactionService')
const ethTransaction = require('../service/ethTransactionService')
const getQuotes = require('../service/quoteService')
require('dotenv').config()


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
        let receipt;
        try {

            switch (request.payload.cryptoCurrencyName) {
                case 'ETH':
                    receipt = await ethTransaction(request.payload.walletAddress, request.payload.cryptoUnitCount);
                    break;
                case 'BNB':
                    receipt = await bnbTransaction(request.payload.walletAddress, request.payload.cryptoUnitCount);
                    break;
                default:
                    return h.response("Currency not supported, please try ETH or BNB").code(404);
            }

            const rampOrder = new RampOrder({
                date: Date.now(),
                amount: request.payload.cryptoUnitCount,
                wallet: request.payload.walletAddress,
                currencyName: request.payload.cryptoCurrencyName,
                status: receipt.status

            });
            const rampSaved = await rampOrder.save();
            const result = {
                success: receipt.status,
                message: rampSaved,
                data: {
                    hash: receipt.transactionHash,
                }
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
    path: '/quotes',
    handler: async (request, h) => {
        const params = request.query

        try {
            const value = await getQuotes(request.query.currency, request.query.amount);
            const data = {
                currency: params.currency,
                amount: params.amount,
                value: value
            }
            return h.response(data).code(200);
        } catch (error) {
            console.log(error);
            return h.response(error).code(500);
        }

    }
}, {
    method: 'GET',
    path: '/admin/analytics',
    handler: async (request, h) => {
        let docs = await RampOrder.aggregate([
            { $addFields: { PreviousDate: { $subtract: [new Date(), (1000 * 60 * 60 * 24 * 30)] } } },
            { $group: { _id:  {wallet : "$wallet" , currencyName: "$currencyName"}, "totalAmount": { "$sum": "$amount" }, count: { $sum: { $cond: [{ $gte: ["$date", "$PreviousDate"] }, 1, 0] } } } },
            { "$sort": { "_id.wallet": 1, "count": -1 } },
            { $limit: 1 }
        ])
        console.log(JSON.stringify(docs))
        return h.response(docs).code(200);


    }
}
];

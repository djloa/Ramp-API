// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';


const bnbTransaction = require('../service/bnbTransactionService')
const ethTransaction = require('../service/ethTransactionService')
const getQuotes = require('../service/quoteService')
const Joi = require('joi');


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
    options: {
        tags: ['api'],
        description: 'Returns data from the order if the transaction succeeds. Please check notes',
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
                if (receipt === false) return h.response("Wallet is not valid, please insert a valid ETH or BNB wallet").code(404);

                const rampOrder = new RampOrder({
                    date: Date.now(),
                    amount: request.payload.cryptoUnitCount,
                    wallet: request.payload.walletAddress,
                    currencyName: request.payload.cryptoCurrencyName,
                    status: receipt.status

                });
                const rampSaved = await rampOrder.save();
                const result = {
                    success: receipt.status.toString(),
                    amount: rampSaved.amount.toString(),
                    currencyName: rampSaved.currencyName,
                    wallet: rampSaved.wallet,
                    idObjectInserted: rampSaved._id,
                    transactionHash: receipt.transactionHash
                }
                return h.response(result).code(200)
            } catch (error) {
                console.log(error);
                return h.response(error).code(500);
            }

        },
        notes: 'WARNING: Since this is a test wallet, ammount is limited to 0.01 on both coins!. CurrencyName options are "ETH" and "BNB", no other options are available',
        tags: ['api'], // ADD THIS TAG
        validate: {
            payload: Joi.object({
                walletAddress: Joi.string()
                    .required()
                    .description('wallet that will receive the funds'),
                cryptoUnitCount: Joi.number().max(0.01)
                    .required()
                    .description('ammount of currency to send.'),
                cryptoCurrencyName: Joi.string()
                    .valid('ETH', 'BNB')
                    .required()
                    .description('Currency name. Accepted currencies are ETH and BNB'),
            })
        },
        response: {
            status: {
                200: Joi.object().keys({
                     success: Joi.any(),
                     amount: Joi.any(),
                     currencyName: Joi.any(),
                     wallet: Joi.any(),
                     idObjectInserted: Joi.any(),
                     transactionHash: Joi.any()
                 }),
                500: Joi.any(),
                404: Joi.any().description("Response when wallet or currency name is not valid")
            }
        }


    }
},
{
    method: 'GET',
    path: '/quotes',
    options: {
        tags: ['api'],
        description: 'Returns Conversion from USD to the Selected Currency',
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

        },
        validate: {
            query: Joi.object({
                currency: Joi.string()
                    .required()
                    .description('Cryptocurrency name.'),
                amount: Joi.string()
                    .required()
                    .description('Amount of USD to be converted'),
            })
        },
        response: {
            status: {
                200: Joi.object({
                    currency: Joi.string(),
                    amount: Joi.string(),
                    value: Joi.number()
                }),
                500: Joi.any()
            }
        }


    }
}, {
    method: 'GET',
    path: '/admin/analytics',
    options: {
        tags: ['api'],
        description: 'Returns the wallet that made most transactions in the last 30 days, and the currency and total amount of those transactions',
        handler: async (request, h) => {
            let docs = await RampOrder.aggregate([
                { $addFields: { PreviousDate: { $subtract: [new Date(), (1000 * 60 * 60 * 24 * 30)] } } },
                { $group: { _id: { wallet: "$wallet", currencyName: "$currencyName" }, "totalAmount": { "$sum": "$amount" }, count: { $sum: { $cond: [{ $gte: ["$date", "$PreviousDate"] }, 1, 0] } } } },
                { "$sort": { "_id.wallet": 1, "count": -1 } },
                { $limit: 1 }
            ])
            console.log(JSON.stringify(docs))
            return h.response(docs[0]).code(200);


        },
        response: {
            status: {
                /*200: Joi.object({
                    _id: Joi.object({
                        wallet: Joi.any(),
                        currencyName: Joi.any()
                    }),
                    totalAmount: Joi.object({
                        $numberDecimal: Joi.any()
                    }),
                    count: Joi.number()
                }),*/
                200: Joi.any(),
                500: Joi.any()
            }
        }
    }
}
];

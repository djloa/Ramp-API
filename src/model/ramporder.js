const mongoose = require('mongoose');
const fs = require("fs")
mongoose.connect(process.env.DB_HOST);

var RampOrderSchema = mongoose.Schema({
    date: Date,
    amount: mongoose.Decimal128,
    currencyName: String,
    wallet: String,
    status: String

});


module.exports = mongoose.model('RampOrder', RampOrderSchema);
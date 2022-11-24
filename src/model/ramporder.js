const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ramp?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.0');

var RampOrderSchema = mongoose.Schema({
    date: Date,
    amount: mongoose.Decimal128,
    currencyName: String,
    wallet: String,
    status: String

});


module.exports = mongoose.model('RampOrder', RampOrderSchema);
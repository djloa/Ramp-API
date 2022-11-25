const axios = require('axios');

module.exports = async function (asset, amount) {
    let response = null;
    try {
        response = await axios.get('https://api.coinbase.com/v2/exchange-rates?currency=' + asset, {
        });
    } catch (ex) {
        response = null;
        // error
        throw ex;
    }
    if (response) {
        // success
        const usdRate = response.data.data.rates.USD;
        return amount / usdRate;
    }
}
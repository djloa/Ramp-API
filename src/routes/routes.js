// Strict mode prevents certain actions from being taken (such as accidentally creating a global variable)
'use strict';


const RampOrder = require('../model/ramporder');

module.exports = [{
    method: 'GET',
    path: '/',
    handler: (request, h) => {
        return "<h1> Hello World!</h1>";
    }
}];
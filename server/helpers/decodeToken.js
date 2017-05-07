const jwt = require('jsonwebtoken');
const helpers = {}
require('dotenv').config();

helpers.decodeToken = function(token) {
    try {
        // console.log('-- token : --' + token);
        var decoded = jwt.verify(token, process.env.TOKEN_SECRET)
        return decoded;
    } catch (error) {
        return ({
            error
        })
    }
}

module.exports = helpers
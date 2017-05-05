const jwt = require('jsonwebtoken')
let methods = {}
require('dotenv').config();

methods.check_token_admin = (req, res, next) => {
    let x = req.headers.token
    jwt.verify(x, process.env.TOKEN_SECRET, (error, decoded) => {
        if (decoded) {
            if (decoded.role === 'admin') {
                next()
            } else {
                res.json({
                    message: `User doesn't have access.`
                })
            }
        } else {
            res.json({
                error
            })
        }
    })
}

methods.check_token_user = (req, res, next) => {
    let x = req.headers.token
    jwt.verify(x, process.env.TOKEN_SECRET, (error, decoded) => {
        if (decoded) {
            if (decoded.role === 'user') {
                next()
            } else {
                res.json({
                    message: `Guess doesn't have access.`
                })
            }
        } else {
            res.json({
                error
            })
        }
    })
}

methods.check_token_both = (req, res, next) => {
    let x = req.headers.token
    jwt.verify(x, process.env.TOKEN_SECRET, (error, decoded) => {
        if (decoded) {
            if (decoded.role === 'admin' || decoded.role === 'user') {
                next()
            } else {
                res.json({
                    message: `Guess doesn't have access.`
                })
            }
        } else {
            res.json({
                error
            })
        }
    })
}

module.exports = methods
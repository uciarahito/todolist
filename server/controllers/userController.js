const mongo = require('mongodb')
const User = require('../models/user')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const Helpers = require('../helpers/decodeToken')
var methods = {}
require('dotenv').config();

methods.insertOne = (req, res, next) => {
    let pwdHash = req.body.password
    let user = new User({
        username: req.body.username,
        password: passwordHash.generate(pwdHash),
        email: req.body.email
    })
    user.save(function(err, record) {
        if (err) return console.error(err);
        res.json(record)
    });
} // insertOne

methods.getAll = (req, res) => {
    User.find({})
        .populate('todo') // populate utk mendapatkan informasi semua property dicollection user
        .exec((err, records) => {
            if (err) {
                res.json({
                    err
                })
            } else {
                // console.log(records)
                res.json(records)
            }
        })
} //getAll

methods.getById = function(req, res) {
    User.findById(req.params.id)
        .populate('todo')
        .exec((err, record) => {
            if (err)
                res.send(err)
            else
                res.json(record)
        })
} // findById ok

// methods.getTodoComplete = function(req, res) {
//     let decoded = Helpers.decodeToken(req.headers.token)
//     let id = decoded._id
//     // console.log('cekk:' + id);
//     User.findById(id)
//         .populate('todo')
//         .exec((err, record) => {
//             if (err) {
//                 res.send(err)
//             } else {
//                 let data = record.todo
//                 data.filter(tdComplete => {
//                     if (tdComplete.status) {
//                         res.json(record)
//                     }
//                 })
//                 // console.log(temp);
//                 // console.log(record.todo[0]);
//             }
//         })
// } // getById

methods.getByUsername = (req, res) => {
    User.findOne({
            username: req.params.username
        })
        .select('username')
        .exec((err, record) => {
            if (err) {
                res.send(err)
            } else {
                res.json(record)
            }
        })
} //getByUsername

methods.updateById = (req, res, next) => {
    let pwdHash = req.body.password
    User.findById(req.params.id)
        .then(record => {
            User.updateOne({
                    "_id": new mongo.ObjectID(req.params.id)
                }, {
                    $set: {
                        "username": req.body.username || record.username,
                        "password": passwordHash.generate(pwdHash) || record.password,
                        "email": req.body.email || record.email,
                        "role": req.body.role || record.role
                    }
                })
                .then((record) => {
                    res.json(record)
                })
                .catch(err => {
                    res.json({
                        err,
                        message: 'Error waktu update User'
                    })
                })
        })
        .catch(err => {
            res.json({
                err,
                message: 'Data tidak ada'
            })
        })
} //updateById

methods.deleteById = (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
        .exec((err, record) => {
            if (err) {
                res.json({
                    err,
                    message: 'Error waktu deleteById'
                })
            } else {
                res.json(record)
            }
        })
} // deleteById

methods.signup = (req, res, next) => {
    let pwdHash = req.body.password
    User.create({
            username: req.body.username,
            password: passwordHash.generate(pwdHash),
            email: req.body.email,
            role: req.body.role
        })
        .then(record => {
            res.json(record)
        })
        .catch(error => {
            res.json({
                error
            })
        })
} // signup

methods.signin = (username, password, next) => {
    User.findOne({
            username: username
        })
        .exec(function(err, record) {
            if (passwordHash.verify(password, record.password)) {
                let data = Object.assign({}, record.toJSON())
                let token = jwt.sign(data, process.env.TOKEN_SECRET, {
                    expiresIn: '1d'
                })
                next(null, {
                    message: 'Login is Successful',
                    token
                })
            } else {
                next({
                    message: 'Your password is not match'
                })
            }
        })
} //signin

module.exports = methods
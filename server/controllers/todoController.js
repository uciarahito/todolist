const mongo = require('mongodb')
const Todo = require('../models/todo')
const User = require('../models/user')
const Helpers = require('../helpers/decodeToken')
const serverSMS = require('../helpers/serverSMS')
const methods = {}

methods.insertOne = (req, res) => {
    let decoded = Helpers.decodeToken(req.headers.token)
    let dueDate = req.body.due_date
    console.log('Semangat');
    // console.log(decoded);
    let cekStatus = req.body.status === undefined ? false : true
    Todo.create({
        user: decoded._id,
        title: req.body.title,
        description: req.body.description,
        due_date: req.body.due_date,
        status: cekStatus
    }, (err, record) => {
        console.log('++++++');
        // console.log(typeof record);
        if (err)
            res.send(err)
        else {
            User.findByIdAndUpdate(record.user, {
                    $push: {
                        todo: record.id
                    }
                }, {
                    new: true
                })
                .exec((err) => {
                    if (err)
                        res.send(err)
                    else {
                        // console.log('due date: ' + dueDate);
                        console.log('test sukses');
                        serverSMS.sendSMS(record)
                        res.json(record)
                    }
                }) // end exec
        }
    })
} // insertOne

methods.getAll = function(req, res) {
    Todo.find({}, (err, records) => {
        if (err)
            res.send(err)
        else
            res.json(records)
    })
} // getAll

methods.getById = function(req, res) {
    Todo.findById(req.params.id)
        .populate('user', 'username')
        .exec((err, record) => {
            if (err)
                res.send(err)
            else
                res.json(record)
        })
} // getById

// methods.getTodoComplete = function(req, res) {
//     let decoded = Helpers.decodeToken(req.headers.token)
//     let id = decoded._id
//     console.log('cekk:' + id);
//     Todo.findById(id)
//         .exec((err, record) => {
//             if (err) {
//                 res.send(err)
//             } else {
//                 // record.filter(tdComplete => {
//                 //     if (!tdComplete.status) {
//                 //     }
//                 // })
//                 res.json(record)
//                 // console.log(record);
//                 // console.log(record.todo[0]);
//             }
//         })
// } // getById

methods.updateById = (req, res, next) => {
    // let cekStatus = req.body.status === undefined ? false : true
    let decoded = Helpers.decodeToken(req.headers.token)
    Todo.findById(req.params.id)
        .then(record => {
            Todo.updateOne({
                    "_id": new mongo.ObjectID(req.params.id)
                }, {
                    $set: {
                        "title": req.body.title || record.title,
                        "description": req.body.description || record.description,
                        "status": req.body.status || record.status,
                        "due_date": req.body.due_date || record.due_date,
                        "updated": new Date || '',
                        "user": decoded._id
                    }
                })
                .then((record) => {
                    res.json(record)
                })
                .catch(err => {
                    res.json({
                        err,
                        message: 'Error waktu update Todo'
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

methods.completeTodo = (req, res, next) => {
    // let cekStatus = req.body.status === undefined ? false : true
    Todo.findById(req.params.id, (err, record) => {
        if (err) {
            res.json({
                err,
                message: 'Error waktu deleteById'
            })
        }
        record.updated = new Date
        if (record.status) {
            record.status = false
        } else {
            record.status = true
        }

        record.save((err, record) => {
            if (err) {
                res.json({
                    err,
                    message: 'Error waktu deleteById'
                })
            }
            res.send(record)
        })
    })
} //completeTodo

methods.deleteById = (req, res, next) => {
    Todo.findByIdAndRemove(req.params.id)
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
}

module.exports = methods
const mongoose = require('mongoose')
let Schema = mongoose.Schema

let todoSchema = new Schema({
    title: String,
    description: String,
    status: {
        type: Boolean,
        default: false
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}) // todoSchema

let Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo
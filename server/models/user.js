const mongoose = require('mongoose')
let Schema = mongoose.Schema

let userSchema = new Schema({
    uuid: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    token: String,
    todo: [{
        type: Schema.Types.ObjectId,
        ref: 'Todo'
    }],
    role: {
        type: String,
        default: "user"
    },
    phone: {
        type: String,
        default: "+6281315853615"
    }
}) // userSchema

let User = mongoose.model('User', userSchema)
module.exports = User
const express = require('express')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var User = require('./models/user')
var controller = require('./controllers/userController')
const jwt = require('jsonwebtoken')
const app = express()
var cors = require('cors')

mongoose.connect('mongodb://localhost/todo-list');

// NOTE: set
app.set('port', process.env.PORT || 3000)

// NOTE: use
/* jika gagal melalui instal cors, maka tambah code di bawah ini */
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*")
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token")
//     next()
// })
app.use(require('morgan')('dev'))
app.use(require('body-parser').urlencoded({
    extended: false
}));
app.use(require('body-parser').json());
app.use(cors())

passport.use(new Strategy(controller.signin));

app.use(passport.initialize());

app.use('/', require('./routes'))

// NOTE: run
app.listen(app.get('port'), () => {
    console.log('Listening on port ' + app.get('port'));
})
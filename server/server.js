const express = require('express')
const passport = require('passport')
const Strategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy;
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var User = require('./models/user')
var Todo = require('./models/todo')
var controller = require('./controllers/userController')
const jwt = require('jsonwebtoken')
const app = express()
var cors = require('cors')
require('dotenv').config();
const passwordHash = require('password-hash')


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

passport.use(new FacebookStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/login/facebook/return'
    },
    function(accessToken, refreshToken, profile, next) {
        console.log('LLLLLLLLLL');

        console.log(accessToken)
        console.log(profile)

        User.findOne({
            uuid: profile.id
        }, (err, user) => {
            if (err) res.send(err);

            if (!user) {

                var newUser = User({
                    username: 'arahito',
                    email: 'uarahito@yahoo.com',
                    password: passwordHash.generate('janganmenyerah'),
                    uuid: profile.id,
                    token: accessToken
                })

                newUser.save((err, user) => {
                    if (err) res.send(err);

                    // res.redirect('http://localhost:8080')
                    console.log(user);
                    return next(null, user);
                })

                // var newTodo = Todo({
                //     name: 'Todo List'
                // })
                // newTodo.save((err, todo) => {
                //
                //     var newUser = User({
                //         username: 'arahito',
                //         email: 'uarahito@yahoo.com',
                //         password: passwordHash.generate('janganmenyerah'),
                //         todo: todo._id,
                //         uuid: profile.id,
                //         token: accessToken
                //     })
                //
                //     newUser.save((err, user) => {
                //         if (err) res.send(err);
                //
                //         // res.redirect('http://localhost:8080')
                //         console.log(user);
                //         return next(null, user);
                //     })
                //
                // }) // end of newTodo.save

            } else {
                console.log("User udah ada")
                console.log(user);

                // res.redirect('http://localhost:8080')

                return next(null, user);
            }
        })
    }));

passport.serializeUser(function(user, next) {
    next(null, user);
});

passport.deserializeUser(function(obj, next) {
    next(null, obj);
});

app.use(passport.initialize());

app.get('/login/facebook',
    passport.authenticate('facebook', {
        scope: 'email,public_profile,user_birthday'
    }));


app.get('/login/facebook/return',
    passport.authenticate('facebook', {
        failureRedirect: '/'
    }),
    function(req, res) {
        console.log('Masukkkk cuyyyy');
        var token = jwt.sign({
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                uuid: req.user.uuid,
                token: req.user.token
            },
            process.env.TOKEN_SECRET, {
                expiresIn: '1d'
            }
        );

        res.redirect(`http://localhost:8080/home.html?token=${token}`);
    });


app.use('/', require('./routes'))

// NOTE: run
app.listen(app.get('port'), () => {
    console.log('Listening on port ' + app.get('port'));
})
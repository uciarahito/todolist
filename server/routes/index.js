'use strict';
const router = require('express').Router()
const userController = require('../controllers/userController')
const jwtHelpers = require('../helpers/check_token')
const passport = require('passport')

// NOTE: USER
router.post('/api/users', jwtHelpers.check_token_admin, userController.insertOne) // admin only
router.get('/api/users', jwtHelpers.check_token_admin, userController.getAll) // admin only
router.get('/api/user/:id', jwtHelpers.check_token_both, userController.getById) // admin and user
router.get('/api/user/:username', jwtHelpers.check_token_both, userController.getByUsername) // admin and user
router.put('/api/user/:id', jwtHelpers.check_token_both, userController.updateById) // admin and user
router.delete('/api/user/:id', jwtHelpers.check_token_both, userController.deleteById) // admin and user

router.post('/api/signup', userController.signup)
router.post('/api/signin', passport.authenticate('local', {
    session: false
}), function(req, res) {
    var user = req.user
    res.send(user)
})


router.get('/', (req, res) => {
    res.send('Haiiiiiii')
})

module.exports = router
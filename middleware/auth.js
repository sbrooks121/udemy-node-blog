const User = require('../database/models/User')

module.exports = (req, res, next) => {
    // fetch user from database
    User.findById(req.session.userId, (error, user) => {
        // verify user
        if (error || !user) {
            // if user is invalid, redirect
            res.redirect('/')
        } else {
            // else permit request
            next()
        }
    })
}
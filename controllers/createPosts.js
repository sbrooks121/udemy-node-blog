module.exports = (req, res) => {
    if (req.session.userId) {
        res.render('createPost') 
    } else {
        res.redirect('/auth/login')
    }
}
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { // This methode comes from passport.
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    };
    next();
}
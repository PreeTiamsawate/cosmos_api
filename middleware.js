module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.send('Please login first.')
    }
    next();
};

// module.exports.authenticateToken= (req, res, next)=>{

// }
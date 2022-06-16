const User = require('./models/User');
const jwt = require('jsonwebtoken');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.send('Please login first.')
    }
    next();
};

module.exports.authenticateToken= (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.send("ACCESS TOKEN NEEDED");
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, userToken) => {
        if (err) return res.send("INVALID TOKEN INSERTED");
        let user = await User.findById(userToken.userId);
        if(!user) return res.send("NO USER FOUND");
        if (user.access_token != token) return res.send("INVALID TOKEN INSERTED");
        res.locals.userId = userToken.userId;
        console.log("Valid Token");
        next()
      });
}


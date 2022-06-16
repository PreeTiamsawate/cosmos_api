if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const { authenticateToken } = require('../middleware');
const jwt = require('jsonwebtoken');

const generateAndSaveToken = async (user) => {
    try{
        const access_token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10000s' })
        await User.findByIdAndUpdate(user._id, { access_token: access_token })
        return access_token;
    }catch(err){
        res.send(err);
    }
   
}
router.post('/register', catchAsync(async (req, res, next) => {
    const { username, password, role } = req.body;
    const user = new User({ role, username });
    await User.register(user, password, (err, user) => {
        if (err) {
            console.dir(err);
            res.send(err.message);
        } else {
            passport.authenticate('local')(req, res, async () => {
                const access_token = await generateAndSaveToken(user);
                res.json({ access_token: access_token, success: true, message: 'User has logged in.', _id: user._id, username: user.username, role: user.role });
            })
        }

    });
}));

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err); // will generate a 500 error
        }
        // Generate a JSON response reflecting authentication status
        if (!user) {
            return res.json({ success: false, message: 'Username or password is not correct.' });
        }
        req.login(user, async (loginErr) => {
            if (loginErr) {
                return next(loginErr);
            }

            const access_token = await generateAndSaveToken(user);
            return res.json({ access_token: access_token, success: true, message: 'User has logged in.', _id: user._id, username: user.username, role: user.role });
        });
    })(req, res, next);
});

router.get('/getUserDetailByToken', (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.send("ACCESS TOKEN NEEDED");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,async (err, userToken) => {
       
        if (err) return res.send("INVALID TOKEN INSERTED");
        let user = await User.findById(userToken.userId);
        res.json({"statusCode":200, "message": "Ok", "data": user})
    })
});
router.get('/testMiddleWare',authenticateToken);
router.post('/testuser', (req, res, next) => {
    res.json(req.body);

});

router.get('/logout',authenticateToken,(req, res, next) => {
    req.logout(async function (err) {
        if (err) { return next(err); }
        try{
            await User.findByIdAndUpdate(res.locals.userId, { access_token: "" })   
            res.send('You have logged out.');
        }catch(e){
            res.send(e);
        }
       
    });

});

module.exports = router;
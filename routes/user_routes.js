const express = require("express");
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/User');
const { isLoggedIn } = require('../middleware');
router.post('/register', catchAsync(async (req, res, next) => {
    const { username, password, role } = req.body;
    const user = new User({ role, username });
    await User.register(user, password, (err, user) => {
        if (err) {
            console.dir(err);
            res.send(err.message);
        } else {
            passport.authenticate('local')(req, res, () => {
                res.json(user);
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
        req.login(user, loginErr => {
            if (loginErr) {
                return next(loginErr);
            }
         
            return res.json({ success: true, message: 'User has logged in.',_id:user._id, username:user.username, role:user.role });
        });
    })(req, res, next);
});

router.get('/getuser',isLoggedIn, (req, res, next) => {
    res.json(req.user);

});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.send('You have logged out.');
    });

});

module.exports = router;
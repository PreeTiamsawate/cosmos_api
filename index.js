if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');;
const userRoutes = require('./routes/user_routes');
const candidateRoutes = require('./routes/candidate_routes');

const cors = require("cors")
app.use(cors({
    origin: "*"
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/cosmosapp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo CONNECTION OPEN!!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR")
        console.log(err)
    })
const sessionConfig = {
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 24 * 3600 * 1000 * 30
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/hello', catchAsync(async (req, res, next) => {
    res.send("Hello 2");
}));
app.use('/api/candidate', candidateRoutes);
app.use('/api/user', userRoutes);

app.all('*', async (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong." } = err;
    // res.status(statusCode).send(message);
    res.json(err);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("ON PORT 3000")
});


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

const DateOfBirth = require('./models/DateOfBirth');


const cors = require("cors")
// var whitelist = ['null', 'http://localhost:3000']
// app.use(cors({
//     origin: function (origin, callback) {
//         if (whitelist.indexOf(origin) !== -1) {
//           callback(null, true)
//         } else {
//           callback(new Error('Not allowed by CORS'))
//         }
//       },
//     credentials: true,
// }))
app.use(cors({
    origin: '*'
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
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // sameSite: 'None',
        expires: Date.now() + 24 * 3600 * 1000 * 30,
    }
}

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/api/hello', catchAsync(async (req, res, next) => {
    res.send("Hello 5");
}));
app.use('/api/candidate', candidateRoutes);
app.use('/api/user', userRoutes);

app.post('/api/adddate', catchAsync(async (req, res, next) => {
    const { date_of_birth,message } = req.body;
    const dateOfBirth = new DateOfBirth({
        date_of_birth: date_of_birth,
        message: message
    })

    const show = await dateOfBirth.save();
    res.json(show);
}));
app.get('/api/getdate/', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let dates = await DateOfBirth.aggregate([
        { $match: {} },
        {
            $set: {
                date_of_birth: { $dateToString: { format: "%Y-%m-%d", date: "$date_of_birth" } },
            }

        }
    ])
    res.json(dates);
}));
app.get('/api/getdate/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let date = await DateOfBirth.findOne({
        "$expr": {
            "$eq": ["$_id", id]
        }
    });
    res.json(date);
}));

app.all('*', async (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong." } = err;
    res.status(statusCode).send(message);
    // res.json(err);
});

app.listen(process.env.PORT || 3030, () => {
    console.log("ON PORT 3030")
});


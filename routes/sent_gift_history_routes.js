const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const SentGiftHistory = require('../models/SentGiftHistory');

router.post('/sendAndRecord', catchAsync(async(req,res,next)=>{
    const {user_id, candidate_id, gift_id, send_date_time, token, price } = req.body;
    const sentGiftHistory = new SentGiftHistory(req.body);
    await sentGiftHistory.save();
    res.send('Data: saved');
}));

router.get('/index', catchAsync(async(req,res,next)=>{
    const history = await SentGiftHistory.find({}).sort('send_date_time');
    res.json(history);
}));

module.exports = router;
const express = require("express");
const axios = require('axios').default;
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { validateSentGift } = require('../middleware');
const SentGiftHistory = require('../models/SentGiftHistory');
const VoteParameter = require('../models/VoteParameter');

router.post('/sendAndRecord', validateSentGift ,catchAsync(async (req, res, next) => {
    
    const { user_id, username, email, candidate_id, gift_id, send_date_time, token, price } = req.body;
    const voteParameters = await VoteParameter.findOne({});

    const pointByToken = voteParameters.pointByToken;
    const point = token * pointByToken;
    const sentGiftHistory = new SentGiftHistory({
        user_id, username, email, candidate_id, gift_id, send_date_time, token, price, point
    });

    const url = 'https://vote.cosmos.starhunterent.com/clientapi/UpdateVoteLog';
    const data = {
        "userid": user_id,
        "username": username,
        "email": email,
        "token": token,
        "point": point,
        "candidate": candidate_id
    };
    const headers = {
        'Content-Type': 'application/json',
        "key": '95182f700496d6c0a27d3bef6e3e6dac'
    }
    const response = await axios.post(url, data, { headers: headers }).catch((e)=>{
        res.send(e)
    })
    console.log(response.data);
    try{
        await sentGiftHistory.save();
        res.send('Vote data sent and saved');
    }catch(e){
        res.send('Vote data sent and not saved');
    }   

}));

router.get('/index', catchAsync(async (req, res, next) => {
    const history = await SentGiftHistory.find({}).sort('send_date_time');
    res.json(history);
}));



module.exports = router;
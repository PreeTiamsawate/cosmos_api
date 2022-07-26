const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const VoteParameter = require('../models/VoteParameter');
const { authenticateToken } = require('../middleware');

router.post('/seed', authenticateToken, catchAsync(async(req,res,next)=>{
    const count = await VoteParameter.count({});
    if(count > 0) return res.send('There must be only one document.') ; 
    const voteParams = new VoteParameter(req.body);
    const show = await voteParams.save();
    res.json(show);
}));

router.get('/getVoteParams', catchAsync(async(req,res,next)=>{
    const voteParams = await VoteParameter.findOne({});
    res.json(voteParams); 
}));

router.patch('/setVoteON', authenticateToken, catchAsync(async(req,res,next)=>{
    const voteStatus = await VoteParameter.findOneAndUpdate(
        {},{isVoteOn: true},{new:true});
    res.json(voteStatus.isVoteOn);    
}));
router.patch('/setVoteOFF', authenticateToken, catchAsync(async(req,res,next)=>{
    const voteStatus = await VoteParameter.findOneAndUpdate(
        {},{isVoteOn: false},{new:true});
    res.json(voteStatus.isVoteOn);    
}));
router.get('/isVoteON',catchAsync(async(req,res,next)=>{
    const voteStatus = await VoteParameter.findOne({});
    res.json(voteStatus.isVoteOn);
}));

router.patch('/setConversionRates', authenticateToken, catchAsync(async(req,res,next)=>{
    const {cash, token1, token2, point} = req.body;
    let cashByToken = cash/token1;
    let pointByToken = point/token2;
    const voteConversionRates = await VoteParameter.findOneAndUpdate(
        {},{
            cash:cash,
            token1:token1,
            token2:token2,
            point:point,
            cashByToken:cashByToken,
            pointByToken:pointByToken      
        },{new:true});
    res.json(voteConversionRates);    
}))



module.exports = router;
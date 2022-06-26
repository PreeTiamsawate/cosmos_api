const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const VoterParameter = require('../models/VoteParameter');
const { authenticateToken } = require('../middleware');

router.post('/seed', authenticateToken, catchAsync(async(req,res,next)=>{
    const count = await VoterParameter.count({});
    if(count > 0) return res.send('There must be only one document.') ; 
    const voteParams = new VoterParameter(req.body);
    const show = await voteParams.save();
    res.json(show);
}));

router.get('/getVoteParams', catchAsync(async(req,res,next)=>{
    const voteParams = await VoterParameter.findOne({});
    res.json(voteParams); 
}));

router.patch('/setVoteON', authenticateToken, catchAsync(async(req,res,next)=>{
    const voteStatus = await VoterParameter.findOneAndUpdate(
        {},{isVoteOn: true},{new:true});
    res.json(voteStatus.isVoteOn);    
}));
router.patch('/setVoteOFF', authenticateToken, catchAsync(async(req,res,next)=>{
    const voteStatus = await VoterParameter.findOneAndUpdate(
        {},{isVoteOn: false},{new:true});
    res.json(voteStatus.isVoteOn);    
}));
router.get('/isVoteON',catchAsync(async(req,res,next)=>{
    const voteStatus = await VoterParameter.findOne({});
    res.json(voteStatus.isVoteOn);
}));

router.patch('/setConversionRates', authenticateToken, catchAsync(async(req,res,next)=>{
    const {cash, token1, token2, point} = req.body;
    const voteConversionRates = await VoterParameter.findOneAndUpdate(
        {},{
            cash:cash,
            token1:token1,
            token2:token2,
            point:point       
        },{new:true});
    res.json(voteConversionRates);    
}))



module.exports = router;
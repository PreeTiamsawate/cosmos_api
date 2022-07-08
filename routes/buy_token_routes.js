const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Bonus = require('../models/Bonus');
const VoterParameter = require('../models/VoteParameter');
const { authenticateToken } = require('../middleware');

router.post('/add',authenticateToken, catchAsync(async(req,res,next)=>{
    const voteParams = await VoterParameter.findOne({});
    const {token, bonus} =  req.body;
    const priceBaht = Math.floor(token*voteParams.cashByToken);
    const bonusSet = new Bonus({token, bonus, priceBaht});
    const show = await bonusSet.save();
    res.json(show);
}));
router.get('/index', catchAsync(async(req, res, next)=>{
    const bonuses = await Bonus.find({}).sort('token');
    res.json(bonuses);
}));
router.get('/show/:id', catchAsync(async(req, res, next)=>{
    const {id} = req.params;
    const bonus = await Bonus.findById(id);
    res.json(bonus);
}));
router.patch('/edit/:id',authenticateToken, catchAsync(async(req,res,next)=>{
    const voteParams = await VoterParameter.findOne({});
    const {token, bonus} =  req.body;
    const priceBaht = Math.floor(token*voteParams.cashByToken);
    const {id} = req.params;
    const bonusSet = await Bonus.findByIdAndUpdate(id, {token, bonus, priceBaht}, {new:true});
    res.json(bonusSet);
}));
router.delete('/delete/:id',authenticateToken, catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const bonus = await Bonus.findByIdAndDelete(id);
    res.json(bonus);
}));    
router.get('/totalTokens/:id', catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const bonusSet = await Bonus.findById(id);
    const totalTokens = bonusSet.token + bonusSet.bonus;
    res.json(totalTokens);
}));

module.exports = router;
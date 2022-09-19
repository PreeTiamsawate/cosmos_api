const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const PageStatus = require('../models/PageStatus.js')
const { authenticateToken } = require('../middleware');

router.post('/seed', catchAsync(async(req,res,next)=>{
    const count = await PageStatus.count({});
    if(count > 0) return res.send('There must be only one document.');
    const pageStatus = new PageStatus(req.body);
    const show = await pageStatus.save();
    res.json(show);
}));

router.get('/getTopCandidatePageStatus', catchAsync(async(req,res,next)=>{
    const pageStatus = await PageStatus.findOne({});
    res.json({
        "isTopCandidatePageOn": pageStatus.isTopCandidatePageOn
    })
}))

router.patch('/setTopCandidatePageON',authenticateToken, catchAsync(async(req,res,next)=>{
    const pageStatus = await PageStatus.findOneAndUpdate(
        {}, {isTopCandidatePageOn: true}, {new:true});
        res.json({
            "isTopCandidatePageOn": pageStatus.isTopCandidatePageOn
        })        
}));

router.patch('/setTopCandidatePageOFF',authenticateToken, catchAsync(async(req,res,next)=>{
    const pageStatus = await PageStatus.findOneAndUpdate(
        {}, {isTopCandidatePageOn: false}, {new:true});
        res.json({
            "isTopCandidatePageOn": pageStatus.isTopCandidatePageOn
        })        
}));

module.exports = router;
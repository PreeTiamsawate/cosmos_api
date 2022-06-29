const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Bonus = require('../models/Bonus');
const { authenticateToken } = require('../middleware');

router.post('/add',authenticateToken, catchAsync(async(req,res,next)=>{
    const bonus = new Bonus(req.body);
    const show = await bonus.save();
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
    const {id} = req.params;
    const bonus = await Bonus.findByIdAndUpdate(id, req.body, {new:true});
    res.json(bonus);
}));
router.delete('/delete/:id',authenticateToken, catchAsync(async(req,res,next)=>{
    const {id} = req.params;
    const bonus = await Bonus.findByIdAndDelete(id);
    res.json(bonus);
}))    


module.exports = router;
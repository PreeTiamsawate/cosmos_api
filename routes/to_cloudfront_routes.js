const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Candidate = require('../models/Candidate');

router.patch('/profile_images', catchAsync(async (req, res, next) => {
    let candidates = await Candidate.find({});

    for(let candidate of candidates){
        candidate.image_profile.url = "https://d1hjq4ezlko9mj.cloudfront.net/"+candidate.image_profile.key;
        await candidate.save();
    }
    
    res.json(candidates);
}));

router.patch('/other_images', catchAsync(async (req, res, next) => {
    let candidates = await Candidate.find({});

    for(let candidate of candidates){
        candidate.images.image_1.url = "https://d1hjq4ezlko9mj.cloudfront.net/"+candidate.images.image_1.key;
        candidate.images.image_2.url = "https://d1hjq4ezlko9mj.cloudfront.net/"+candidate.images.image_2.key;
        candidate.images.image_3.url = "https://d1hjq4ezlko9mj.cloudfront.net/"+candidate.images.image_3.key;
        candidate.images.image_4.url = "https://d1hjq4ezlko9mj.cloudfront.net/"+candidate.images.image_4.key;
        await candidate.save();
    }
    res.json(candidates);
}));

module.exports = router;


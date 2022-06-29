const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Candidate = require('../models/Gift');
const { authenticateToken } = require('../middleware');
const multer = require("multer");
const { giftStorage, bucketName, s3Delete } = require('../utils/awsS3');
const Gift = require("../models/Gift");


const upload = multer({ storage: giftStorage });

router.post('/add', authenticateToken, upload.single('image'), catchAsync(async(req,res,next)=>{
    const image = req.file;
    const gift =  new Gift(req.body);
    if(image){
        gift.image = {
            url: image.location,
            key: image.key
        }
    }
    const show = await gift.save();
    res.json(show);
}));
router.get('/index', catchAsync(async(req, res, next)=>{
    let gifts = await Gift.find({}).sort('token');
    res.json(gifts);
}));
router.get('/show/:id', catchAsync(async(req, res, next)=>{
    const { id } = req.params;
    const gift = await Gift.findById(id);
    res.json(gift);
}))
router.patch('/edit/:id', authenticateToken,upload.single('image') ,catchAsync(async(req,res,next)=>{
    const { id } = req.params;
    const {name, token} = req.body;
    const image = req.file;
    const gift = await Gift.findById(id);
    if(image){
        if(gift.image.key) s3Delete(bucketName, gift.image.key);
        gift.image = {
            url: image.location,
            key: image.key
        }
    }
    gift.name = name;
    gift.token = token;

    await gift.save();
    res.json(gift);
}));
router.delete('/delete/:id', authenticateToken, catchAsync(async(req,res,next)=>{
    const { id } = req.params;
    const gift = await Gift.findByIdAndDelete(id);
    if(gift.image.key) s3Delete(bucketName, gift.image.key);
    res.json(gift);
}))



module.exports = router;




const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Candidate = require('../models/Candidate');
const { authenticateToken } = require('../middleware');
const multer = require("multer");
const { storage, bucketName, s3Delete } = require('../utils/awsS3');

const upload = multer({ storage })

router.get('/index', catchAsync(async (req, res, next) => {
    const { q, skip , limit} = req.query;   
    let candidates = await Candidate
    .find({
        $or: [
            { "code": { "$regex": q, "$options": "i" } },
            { "first_name_th": { "$regex": q, "$options": "i" } },
            { "first_name_en": { "$regex": q, "$options": "i" } },
        ]
    }).sort('code').skip(parseInt(skip)-1).limit(parseInt(limit)).lean()

    for(let i =0; i < candidates.length; i++){
        if(candidates[i+1]) candidates[i].next = candidates[i+1]._id ;
        else candidates[i].next =null;
        if(candidates[i-1]) candidates[i].previous = candidates[i-1]._id ;
        else candidates[i].previous =null;
    }
    res.json(candidates);
}));
router.get('/all_count', catchAsync(async (req, res, next) => {
    await Candidate.countDocuments({},function(err,all_candidate_count){
        if(err) next(err);
     
        res.json(all_candidate_count);
    }).clone();

}));
router.post('/add',authenticateToken, upload.fields([{
    name: 'image_profile', maxCount: 1
}, {
    name: 'image_1', maxCount: 1
}, {
    name: 'image_2', maxCount: 1
}, {
    name: 'image_3', maxCount: 1
}, {
    name: 'image_4', maxCount: 1
},
]), catchAsync(async (req, res, next) => {
    const { ref_code, code, first_name_th, last_name_th, first_name_en, last_name_en, nick_name_th, nick_name_en, instagrame_acc, facebook_acc, candidate_status } = req.body;
    const { image_profile, image_1, image_2, image_3, image_4 } = req.files;
    const candidate = new Candidate({
        ref_code: ref_code,
        code: code,
        first_name_th: first_name_th,
        last_name_th: last_name_th,
        first_name_en: first_name_en,
        last_name_en: last_name_en,
        nick_name_th: nick_name_th,
        nick_name_en: nick_name_en,
        instagrame_acc: instagrame_acc,
        facebook_acc: facebook_acc,
        candidate_status: candidate_status,
    });
    if (image_profile) {
        candidate.image_profile = {
            url: image_profile[0].location,
            key: image_profile[0].key,
        }
    }
    if (image_1) {
        candidate.images.image_1 = {
            url: image_1[0].location,
            key: image_1[0].key,
        }
    }
    if (image_2) {
        candidate.images.image_2 = {
            url: image_2[0].location,
            key: image_2[0].key,
        }
    }
    if (image_3) {
        candidate.images.image_3 = {
            url: image_3[0].location,
            key: image_3[0].key,
        }
    }
    if (image_4) {
        candidate.images.image_4 = {
            url: image_4[0].location,
            key: image_4[0].key,
        }
    }
    const show = await candidate.save();
    res.json(show);
}));
router.get('/show/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;

    let candidates = await Candidate.find({}).sort('code').lean()
    for(let i =0; i < candidates.length; i++){
        if(candidates[i+1]) candidates[i].next = candidates[i+1]._id ;
        else candidates[i].next =null;
        if(candidates[i-1]) candidates[i].previous = candidates[i-1]._id ;
        else candidates[i].previous =null;
        if(candidates[i]._id == id){
            console.log(true); 
            var candidate = candidates[i];
        } 
        else console.log(false)
    }
    res.json(candidate);
}));
router.delete('/delete/:id',authenticateToken, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const gone = await Candidate.findByIdAndDelete(id);
    res.json(gone);
}));
router.patch('/edit/:id',authenticateToken, upload.fields([{
    name: 'image_profile', maxCount: 1
}, {
    name: 'image_1', maxCount: 1
}, {
    name: 'image_2', maxCount: 1
}, {
    name: 'image_3', maxCount: 1
}, {
    name: 'image_4', maxCount: 1
},
]), catchAsync(async (req, res, next) => {
    const { ref_code, code, first_name_th, last_name_th, first_name_en, last_name_en, nick_name_th, nick_name_en, instagrame_acc, facebook_acc, candidate_status } = req.body;
    const { image_profile, image_1, image_2, image_3, image_4 } = req.files;
    const { id } = req.params;

    let candidate = await Candidate.findById(id);
    if (image_profile) {
        if (candidate.image_profile.key) s3Delete(bucketName, candidate.image_profile.key);
        candidate.image_profile = {
            url: image_profile[0].location,
            key: image_profile[0].key,
        }
        candidate.imageProfile
    }
    if (image_1) {
        if (candidate.images.image_1.key) s3Delete(bucketName, candidate.images.image_1.key)
        candidate.images.image_1 = {
            url: image_1[0].location,
            key: image_1[0].key,
        }
    }
    if (image_2) {
        if (candidate.images.image_2.key) s3Delete(bucketName, candidate.images.image_2.key)
        candidate.images.image_2 = {
            url: image_2[0].location,
            key: image_2[0].key,
        }
    }
    if (image_3) {
        if (candidate.images.image_3.key) s3Delete(bucketName, candidate.images.image_3.key)
        candidate.images.image_3 = {
            url: image_3[0].location,
            key: image_3[0].key,
        }
    }
    if (image_4) {
        if (candidate.images.image_4.key) s3Delete(bucketName, candidate.images.image_4.key)
        candidate.images.image_4 = {
            url: image_4[0].location,
            key: image_4[0].key,
        }
    }
    candidate.ref_code = ref_code;
    candidate.code = code;
    candidate.first_name_th = first_name_th;
    candidate.last_name_th = last_name_th;
    candidate.first_name_en = first_name_en;
    candidate.last_name_en = last_name_en;
    candidate.nick_name_th = nick_name_th;
    candidate.nick_name_en = nick_name_en;
    candidate.instagrame_acc = instagrame_acc;
    candidate.facebook_acc = facebook_acc;
    candidate.candidate_status = candidate_status;

    await candidate.save();
    res.json(candidate);
}));

router.get('/search', catchAsync(async (req, res, next) => {
    const { q } = req.query;
    const candidates = await Candidate.find({
        $or: [
            { "code": { "$regex": q, "$options": "i" } },
            { "first_name_th": { "$regex": q, "$options": "i" } },
            { "nick_name_th": { "$regex": q, "$options": "i" } },
            { "first_name_en": { "$regex": q, "$options": "i" } },
            { "nick_name_en": { "$regex": q, "$options": "i" } }
        ]
    });
    res.json(candidates);
}));

router.get('/total_points', catchAsync(async (req, res, next) => {
    const allTotalPoints = await Candidate.find({}).select('code total_points');
    res.json(allTotalPoints);
}));

router.get('/total_points/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const totalPointsById = await Candidate.findById(id).select('code total_points');
    res.json(totalPointsById);
}));


module.exports = router;
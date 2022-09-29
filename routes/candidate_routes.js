const express = require("express");
const axios = require('axios').default;
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Candidate = require('../models/Candidate');
const VoteParameter = require('../models/VoteParameter');
const { authenticateToken, authenticateVoter } = require('../middleware');
const multer = require("multer");
const { storage, bucketName, s3Delete } = require('../utils/awsS3');

const upload = multer({ storage:storage })


router.get('/index', catchAsync(async (req, res, next) => {
    const { q, skip, limit } = req.query;
    let candidates = await Candidate
        .aggregate([
            {
                $match: {
                    candidate_status: "เข้ารอบ",
                    $or: [
                        { "code": { "$regex": q, "$options": "i" } },
                        { "first_name_th": { "$regex": q, "$options": "i" } },
                        { "first_name_en": { "$regex": q, "$options": "i" } },  
                    ]
                }
            },
            {
                $project:{
                    image_profile: 1, _id: 1, code: 1, first_name_th: 1, last_name_th: 1, first_name_en: 1, last_name_en: 1, nick_name_th: 1, nick_name_en: 1, candidate_status:1 
                }

            }
        ]).sort('code').skip(parseInt(skip || 1) - 1).limit(parseInt(limit || 100000))

    for (let i = 0; i < candidates.length; i++) {
        if (candidates[i + 1]) candidates[i].next = candidates[i + 1]._id;
        else candidates[i].next = null;
        if (candidates[i - 1]) candidates[i].previous = candidates[i - 1]._id;
        else candidates[i].previous = null;
    }
    console.log('Candidate list havs been called.')
    res.json(candidates);
}));
router.get('/all_count', catchAsync(async (req, res, next) => {
    await Candidate.countDocuments({}, function (err, all_candidate_count) {
        if (err) next(err);

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
    // const { ref_code, code, first_name_th, last_name_th, first_name_en, last_name_en, nick_name_th, nick_name_en, instagrame_acc, facebook_acc, candidate_status } = req.body;
    const { image_profile, image_1, image_2, image_3, image_4 } = req.files;
    const candidate = new Candidate(req.body);
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

    let candidates = await Candidate.aggregate([
        {
            $match: {}
        },
        {
            $set: {
                date_of_birth: { $dateToString: { format: "%Y-%m-%d", date: "$date_of_birth" } },
            }
        },
        {
            $project:{
                total_points:0
            }

        }
    ]).sort('code')

    var candidate = candidates.find((can)=> can._id == id)
    var prevCand = candidates[candidates.indexOf(candidate)-1];
    var nextCand = candidates[candidates.indexOf(candidate)+1];

    if(prevCand) candidate.previous = prevCand._id;
    else candidate.previous = null;

    if(nextCand) candidate.next = nextCand._id;
    else candidate.next = null;
    
    console.log(`Candidate ${id} has been called.`);
    res.json(candidate);
}));

router.delete('/delete/:id', authenticateToken, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const gone = await Candidate.findByIdAndDelete(id);
    console.log(`Candidate ${id} has been deleted.`);
    res.json(gone);
}));
router.patch('/edit/:id', authenticateToken, upload.fields([{
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
    const { ref_code, code, first_name_th, last_name_th, first_name_en, last_name_en, nick_name_th, nick_name_en, instagrame_acc, facebook_acc, candidate_status, date_of_birth, height, province, hobby, like } = req.body;
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
    candidate.date_of_birth = date_of_birth;
    candidate.height = height,
        candidate.province = province;
    candidate.hobby = hobby;
    candidate.like = like;

    await candidate.save();
    console.log(`Candidate ${id} has been edited.`);
    res.json(candidate);
}));

router.get('/search', catchAsync(async (req, res, next) => {
    const { q } = req.query;
    const candidates = await Candidate.aggregate([
        {
            $match: {
                $or: [
                    { "code": { "$regex": q, "$options": "i" } },
                    { "first_name_th": { "$regex": q, "$options": "i" } },
                    { "nick_name_th": { "$regex": q, "$options": "i" } },
                    { "first_name_en": { "$regex": q, "$options": "i" } },
                    { "nick_name_en": { "$regex": q, "$options": "i" } }
                ]
            }
        },
        {
            $set: {
                date_of_birth: { $dateToString: { format: "%Y-%m-%d", date: "$date_of_birth" } },
            }
    
        }
    ]).sort('code');
    for (let i = 0; i < candidates.length; i++) {
        if (candidates[i + 1]) candidates[i].next = candidates[i + 1]._id;
        else candidates[i].next = null;
        if (candidates[i - 1]) candidates[i].previous = candidates[i - 1]._id;
        else candidates[i].previous = null;
    }
    res.json(candidates);
}));


router.get('/total_points', catchAsync(async (req, res, next) => {
    const allTotalPoints = await Candidate.find({}).select('code total_points');
    console.log('All candidate total points have been called.')
    res.json(allTotalPoints);
}));

router.get('/total_points/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const totalPointsById = await Candidate.findById(id).select('code total_points');
    console.log(`Candidate ${id}  total points has been called.`)
    res.json(totalPointsById);
}));
router.patch('/total_points/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const {total_points} = req.body;
    console.log(total_points)
    const newTotalPointsById = await Candidate.findByIdAndUpdate(id,
        {total_points:total_points},
        {returnOriginal: false}
        ).select('code total_points');
    console.log(`Candidate ${id}  total points has been updated.`)
    res.json(newTotalPointsById);
}));
router.get('/topfive',catchAsync(async (req, res, next) => {
    const topFiveCandidates = await Candidate.find({total_points:{$gt:0}, candidate_status: "เข้ารอบ"}).sort({total_points:-1, code:1})
    .select('image_profile _id code first_name_th last_name_th first_name_en last_name_en nick_name_th nick_name_en candidate_status')
    .limit(5);
    console.log(`Top five candidates have been called`);
    res.json(topFiveCandidates);

}));
router.get('/candidatesbytotalpoints',catchAsync(async (req, res, next) => {
    const { skip,limit } = req.query;
    const candidatesbytotalpoints = await Candidate.find({candidate_status: "เข้ารอบ"}).sort({total_points:-1, code:1})
    .select('image_profile _id code first_name_th last_name_th first_name_en last_name_en nick_name_th nick_name_en candidate_status')
    .skip(parseInt(skip || 1) - 1).limit(parseInt(limit || 100000));

    console.log(`Candidate list sorted by total points has been called.`);
    res.json(candidatesbytotalpoints);
}));
router.get('/deadzone',catchAsync(async (req, res, next) => {
    const { skip,limit } = req.query;
    const candidatesbytotalpoints = await Candidate.find({candidate_status: "เข้ารอบ"}).sort({total_points:1, code:1})
    .select('image_profile _id code first_name_th last_name_th first_name_en last_name_en nick_name_th nick_name_en candidate_status')
    .skip(parseInt(skip || 1) - 1).limit(parseInt(limit || 100000));

    console.log(`Dead Zone candidates by total points has been called.`);
    res.json(candidatesbytotalpoints);
}));
router.get('/candidatesbytotalpointswithpoints',catchAsync(async (req, res, next) => {
    const { limit } = req.query;
    const candidatesbytotalpoints = await Candidate.find({}).sort({total_points:-1, code:1})
    .select('_id code first_name_en last_name_en nick_name_en total_points candidate_status')
    .limit(parseInt(limit || 100000));
    res.json(candidatesbytotalpoints);
}));

router.patch('/addPointsToCandidate', authenticateVoter, catchAsync(async(req, res, next)=>{
    const {candidate_id, vote_token} = req.body;
    if(isNaN(vote_token)) return res.send('Points must be number type.');
    const voterId = res.locals.voterId;
    
    const url = `https://vote.cosmos.starhunterent.com/clientapi/get_user_profile/${voterId}`;
    const headers = {
        'Content-Type': 'application/json',
        "key": '95182f700496d6c0a27d3bef6e3e6dac'
    }
    const response = await axios.get(url,{ headers: headers }).catch((e)=>{
        res.send(e)
    })
    const voterTokenBalance = response.data.balance;

    console.log(`Voter balance: ${voterTokenBalance}`);

    if(voterTokenBalance < vote_token) return res.send('Voter does not have enough tokens to vote.');

    const voteParameters = await VoteParameter.findOne({});
    const pointByToken = voteParameters.pointByToken;
    let points = vote_token * pointByToken;

    const candidate =  await Candidate.findByIdAndUpdate(candidate_id,
        { $inc: {"total_points": points } }, 
        {new: true }
    );
    
    console.log(`${voterId} have added ${points} points to ${candidate._id}.`);
    res.json({
        "candidate_id": candidate._id,
        "total_points": candidate.total_points,
        "voter_id": voterId
    });
}));


module.exports = router;
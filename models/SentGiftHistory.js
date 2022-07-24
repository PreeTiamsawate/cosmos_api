const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sentGiftHistorySchema = new Schema({
    user_id:{
        type: String,
        required:[true, 'user_id required'],
    },
    candidate_id:{
        type: String,
        required:[true, 'candidate_id required'],
    },
    gift_id:{
        type: String,
        required:[true, 'gift_id required'],
    },
    send_date_time:{
        type:Date, 
        required:[true, 'send_date_time required'],
    },
    token:{
        type:Number,
        required:[true, 'token required'],
    },
    price:{
        type:Number,
        required:[true, 'price required'],
    }
})

const SentGiftHistory = mongoose.model('SentGiftHistory', sentGiftHistorySchema);
module.exports = SentGiftHistory
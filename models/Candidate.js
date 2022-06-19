const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    ref_code: {
        type: String,
    },
    code: {
        type: String,
        required: [true, 'กรุณากรอก รหัสใหม่ของผู้สมัคร'],
        unique: [true, 'code นี้มีอยู่แล้ว']
    },
    first_name_th: {
        type: String,
        required: [true, 'กรุณากรอก ชื่อจริง(ไทย)ของผู้สมัคร']
    },
    last_name_th: {
        type: String,
        required: [true, 'กรุณากรอก นามสกุล(ไทย)ของผู้สมัคร']
    },
    first_name_en: {
        type: String,
        required: [true, 'กรุณากรอก ชื่อจริง(Eng)ของผู้สมัคร']
    },
    last_name_en: {
        type: String,
        required: [true, 'กรุณากรอก นามสกุล(Eng)ของผู้สมัคร']
    },
    nick_name_th: {
        type: String,
        required: [true, 'กรุณากรอก ชื่อเล่น(ไทย)ของผู้สมัคร']
    },
    nick_name_en: {
        type: String,
        required: [true, 'กรุณากรอก ชื่อเล่น(Eng)ของผู้สมัคร']
    },
    instagrame_acc: {
        type: String,
        required: [true, 'กรุณากรอก Instagramของผู้สมัคร']
    },
    facebook_acc: {
        type: String,
        required: [true, 'กรุณากรอก Facebookของผู้สมัคร']
    },
    total_points: {
        type: Number,
        default: 0
    },
    candidate_status: {
        type: String,
        enum: ['เข้ารอบ', 'ตกรอบแล้ว'],
        default: 'เข้ารอบ'
    },
    add_date: {
        type: Number,
        default: Date.now()
    },
    image_profile: {
        url: { type: String },
        key: { type: String }
    },
    images: {
        image_1:{
            url: String,
            key: String,
        },
        image_2:{
            url: String,
            key: String,
        },
        image_3:{
            url: String,
            key: String,
        },
        image_4:{
            url: String,
            key: String,
        },
        // validate: [arrayLimit, 'ใส่รูปได้มากสุด 5 รูป']
    },
    date_of_birth:{
        type:Date, 
    },
    height:{
        type:String
    },
    province:{
        type:String
    },
    hobby:{
        type:String
    },
    like:{
        type:String
    }
});
// function arrayLimit(val) {
//     return val.length <= 10;
// }
const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;


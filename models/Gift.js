const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const giftSchema = new Schema({
    name:{
        type: String,
        required: [true, 'กรุณากรอก ชื่อของขวัญ']
    },
    token:{
        type: Number,
        required: [true, 'กรุณากรอก จำนวน Token']
    },
    image: {
        url: { type: String },
        key: { type: String }
    }
});

const Gift = mongoose.model('Gift', giftSchema);
module.exports = Gift;
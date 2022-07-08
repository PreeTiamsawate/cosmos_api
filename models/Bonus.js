const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const bonusSchema = new Schema({
    token:{
        type:Number,
        required: [true, 'กรุณากรอก Token'],
        default: 1
    },
    bonus:{
        type:Number,
        required: [true, 'กรุณากรอก Bonus'],
        default: 0
    },
    priceBaht:{
        type:Number
    }
});

const Bonus = mongoose.model('Bonus', bonusSchema);

module.exports = Bonus;
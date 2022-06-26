const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const voteParameterSchema = new Schema({
    isVoteOn:{
        type: Boolean,
        required: true,
        default: false
    },
    cash:{
        type:Number,
        required: [true, 'กรุณากรอก Cash'],
        default: 1
    },
    token1:{
        type:Number,
        required: [true, 'กรุณากรอก Token'],
        default: 1
    },
    token2:{
        type:Number,
        required: [true, 'กรุณากรอก Token'],
        default: 1
    },
    point:{
        type:Number,
        required: [true, 'กรุณากรอก Point'],
        default: 1
    }
});

const VoterParameter = mongoose.model('VoterParameter', voteParameterSchema);

module.exports = VoterParameter
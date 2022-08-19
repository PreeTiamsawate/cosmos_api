const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pageStatusSchema = new Schema({
    isTopCandidatePageOn:{
        type: Boolean,
        required: [true, 'please set true or false'],
        default: true
    }
});

const PageStatus = mongoose.model('PageStatus', pageStatusSchema);

module.exports = PageStatus;
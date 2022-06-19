const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateSchema = new Schema(
    {
        date_of_birth:{
            type:Date, 
        },
        message:{
            type:String, 
        },
    }
);

const DateOfBirth = mongoose.model('DateOfBirth',dateSchema);

module.exports = DateOfBirth;
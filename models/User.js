const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    
    role: {
        type: String,
        required: true,
        default: 'admin',
        enum: ['customer', 'admin'],
    },
    access_token: {
        type: String
    }

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
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

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
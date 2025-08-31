const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
     username: { // Define it explicitly for clarity
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cartItems: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    otp: String,
    otpExpires: Date,

    otpVerified: {
    type: Boolean,
    default: false
}

});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

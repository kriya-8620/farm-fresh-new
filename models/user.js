const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
<<<<<<< HEAD
     username: { // Define it explicitly for clarity
        type: String,
        required: true,
        unique: true
    },
=======
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd
    email: {
        type: String,
        required: true,
        unique: true
    },
    cartItems: [{
        name: String,
        price: Number,
        quantity: Number
<<<<<<< HEAD
    }],
    otp: String,
    otpExpires: Date,

    otpVerified: {
    type: Boolean,
    default: false
}

=======
    }]
>>>>>>> 4c7d39e3bbc23ed1d322c25e129c105b7c2abefd
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

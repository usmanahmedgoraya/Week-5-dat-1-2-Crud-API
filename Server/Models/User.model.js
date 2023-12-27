const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        min: [5, "please enter at least 5 characters"],
        max: [15, "please enter at most 15 characters"]
    }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
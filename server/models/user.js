const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({ //Schema
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
});

const User = new mongoose.model("User", userSchema); //Model defining

module.exports = User;

const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    city: {
        type: String,
        require: true
    },
    pincode: {
        type: Number,
        require: true
    },
    phoneNumber: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}, { timestamps: true });

const userTable = mongoose.model("user",userSchema);
module.exports = userTable


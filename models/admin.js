const mongoose = require("mongoose")


const adminSchema = new mongoose.Schema({
    email : {type : String , required : true},
    password : {type : String , required : true},
    status: {type: Boolean, default: true},
},{ timestamps: true })

const adminTable = mongoose.model("admin",adminSchema);
module.exports= adminTable

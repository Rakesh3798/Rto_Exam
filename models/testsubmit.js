const mongoose = require("mongoose");
const { type } = require("os");


const testsubmitSchema = new mongoose.Schema({
    testId :{
        type: String,
        require:true
    },
    userId :{
        type: String,
        require:true
    },
    questions:[{
        _id : false,
        questionId:{
            type: mongoose.Schema.Types.ObjectId,
            require:true
        },
        seleteOption:{
            type: String,
            require:true
        },
        correctOption: {
            type: String,
            required: true
        },
    }]
})

const testsubmitTable = mongoose.model("testsubmit",testsubmitSchema);
module.exports=testsubmitTable


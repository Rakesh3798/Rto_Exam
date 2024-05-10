const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    question_ur: {
        type: String,
        required: true
    },
    option_A:{
        type:String,
        required: false
    },
    option_A_ur:{
        type:String,
        required:false
    },
    option_B:{
        type:String,
        required: false
    },
    option_B_ur:{
        type:String,
        required:false
    },
    option_C:{
        type:String,
        required: false
    },
    option_C_ur:{
        type:String,
        required:false
    },
    option_D:{
        type:String,
        required: false
    },
    option_D_ur:{
        type:String,
        required:false
    },
    image :{
        type : String , 
        required : true
    },
    correctOption: {
        type: String,
        required: true
    },    
},{ timestamps: true });

const questionTable = mongoose.model('question', questionSchema);

module.exports = questionTable;

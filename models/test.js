const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  testName: {
    type: String,
    required: true
  },
  questionId:{
    type: [mongoose.Schema.Types.ObjectId], 
    required: true
  },
  time: {
    type: Number,
    required: true
  }
},{ timestamps: true });

const testTable = mongoose.model('test', testSchema);

module.exports = testTable;

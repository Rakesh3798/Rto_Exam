const express = require('express');
const { question, upload, questionList, editquestion, deletequestion } = require('../controller/questionController');
const authMiddleware = require('../middlewares/auth');
const questionRouter = express.Router();

questionRouter.post("/saveQuestion",authMiddleware,upload.single('image'),async(req,resp)=>{
    await question(req,resp);
})

questionRouter.get("/questionList",authMiddleware,async(req,resp)=>{
    await questionList(req,resp);
})

questionRouter.put("/editquestion/",authMiddleware,upload.single('image'),async(req,resp)=>{
    await editquestion(req,resp);
})

questionRouter.delete("/deletequestion/",authMiddleware,async(req,resp)=>{
    await deletequestion(req,resp);
})

module.exports = questionRouter;

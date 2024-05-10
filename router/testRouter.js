const express = require("express");
const { test, testedit, testresult, totalTestCount, testdelete } = require("../controller/testController");
const authMiddleware = require("../middlewares/auth");
const testRouter = express.Router();

testRouter.post("/addtest",authMiddleware,async(req,resp)=>{
    await test(req,resp);
});

testRouter.put("/testedit",authMiddleware,async(req,resp)=>{
    await testedit(req,resp);
})

testRouter.post("/testsave",authMiddleware,async(req,resp)=>{
    await testresult(req,resp);
})

testRouter.get("/totalTestCount",authMiddleware,async(req,resp)=>{
    await totalTestCount(req,resp);
})

testRouter.delete("/testdelete",authMiddleware,async(req,resp)=>{
    await testdelete(req,resp);
})

module.exports = testRouter
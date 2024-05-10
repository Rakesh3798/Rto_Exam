const express = require("express");
const { userRegister, userLogin, userList } = require("../controller/userController");
const authMiddleware = require("../middlewares/auth");
const userRouter = express.Router();

userRouter.post("/register",async(req,resp)=>{
    await userRegister(req,resp);
});

userRouter.post("/login",async(req,resp)=>{
    await userLogin(req,resp);
});

userRouter.get("/list",authMiddleware,async(req,resp)=>{
    await userList(req,resp);
})

module.exports = userRouter
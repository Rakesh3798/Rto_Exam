const express = require("express");
const { loginAdmin, userlist } = require("../controller/adminController");
const authMiddleware = require("../middlewares/auth");
const adminRouter = express.Router();

adminRouter.post("/login",async(req,resp)=>{
    await loginAdmin(req,resp)
})

adminRouter.get("/userlist", authMiddleware, (req, res) => {
    userlist(req, res);
});

module.exports = adminRouter;
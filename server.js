const mongoose = require("mongoose");
const express = require("express");
const adminRouter = require("./router/adminRouter");
const questionRouter = require("./router/questionRouter");
const dotenv = require("dotenv").config();
const app = express();
const bodyparser = require("body-parser");
const testRouter = require("./router/testRouter");
const userRouter = require("./router/userRouter");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
const port = process.env.PORT;
const db_url = process.env.DB_URL;                                                        

mongoose.connect(db_url).then(()=>{
    console.log("Db Connected");
}).catch(err=>{
    console.log("Db Not Connected");
})

app.use(express.json());
app.use("/admin",adminRouter);
app.use("/question",questionRouter);
app.use("/test",testRouter);
app.use("/user",userRouter);

app.get("/",(req,resp)=>{
    resp.json("Hiiii")
})

app.listen(port,()=>{
    console.log(`server running on port http://localhost:${port}`);
})
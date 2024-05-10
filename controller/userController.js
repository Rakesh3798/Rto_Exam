const bcryptjs = require("bcryptjs");
const userTable = require("../models/user");
const App_Status = require("../contact/contact");
const Jwt = require("jsonwebtoken")

const userRegister = async (request, response) => {
    try {
        const { userName, email, address, city, pincode, phoneNumber, password } = request.body;
        const existingUserName = await userTable.findOne({ userName });
        if (existingUserName) {
            return response.status(400).json({
                status: App_Status.Failed,
                message: "Username already exists",
                data: null
            });
        }

        const existingEmail = await userTable.findOne({ email });
        if (existingEmail) {
            return response.status(400).json({
                status: App_Status.Failed,
                message: "Email already exists",
                data: null
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = new userTable({
            userName,
            email,
            address,
            city,
            pincode,
            phoneNumber,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        return response.status(201).json({
            status: App_Status.Success,
            message: "User registered successfully",
            data: savedUser
        });
    } catch (error) {
        return response.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: null
        });
    }
};


const userLogin = async(request,response)=>{
    try {
        let {email,password} = request.body

        let theUserObj = await userTable.findOne({email:email})
        if(!theUserObj){
            return response.status(401).json({
                status : App_Status.Failed,
                message : "Invalid Email"
            })
        }

        let ismatch = await bcryptjs.compare(password,theUserObj.password)
        if(!ismatch){
            return response.status(401).json({
                status : App_Status.Failed,
                message : "Invalid Password"
            })
        } 

        let payload = {
            id : theUserObj._id,
            email : theUserObj.email,
            password : theUserObj.password
        }

        let secretKey = process.env.SECRET_KEY

        if(payload && secretKey){
            let token = Jwt.sign(payload,secretKey,{expiresIn : "1h"})
            return response.status(200).json({
                status : App_Status.Success,
                message :"User Login SuccessFully",
                data : theUserObj ,
                token : token
            })
        }
    } catch (error) {
        return response.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: null
        })
    }
}

const userList = async (req, res) => {
    try {
        const { userName } = req.query;
        const userList = await userTable.find({ userName });
        console.log(req.uid);
        if (userList.length > 0) {
            return res.status(200).json({
                status: App_Status.Success,
                message: "User List Successfully",
                data: userList
            });
        } else {
            return res.status(404).json({
                status: App_Status.Failed,
                message: "User not found",
                data: null
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: null
        });
    }
};


module.exports = {
    userRegister,
    userLogin,
    userList
};

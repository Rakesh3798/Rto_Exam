const App_Status = require("../contact/contact")
const JWT = require("jsonwebtoken")
const bcryptjs = require("bcryptjs");
const adminTable = require("../models/Admin");
const { response } = require("express");
const userTable = require("../models/user");
const testsubmitTable = require("../models/testsubmit");

const loginAdmin = async (request, response) => {
    try {
        let { email, password } = request.body;
        
        let theUserObj = await adminTable.findOne({ email: email });
        if (!theUserObj) {
            return response.status(401).json({
                status: App_Status.Failed,
                message: "Invalid Email",
                data: null
            });
        }
        
        let isMatch = await bcryptjs.compare(password, theUserObj.password);
        if (!isMatch) {
            return response.status(401).json({
                status: App_Status.Failed,
                message: "Invalid Password",
                data: null
            });
        }

        let payload = {
            id: theUserObj._id,
            email: theUserObj.email,
            password: theUserObj.password
        };

        let secretKey = process.env.SECRET_KEY;

        if (payload && secretKey) {
            let token = JWT.sign(payload, secretKey, { expiresIn: "1h" });
            return response.status(200).json({
                status: App_Status.Success,
                message: "Admin Login Successfully",
                data: theUserObj,
                token: token
            });
        }
    } catch (error) {
        return response.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: null
        });
    }
};
 
const userlist = async (req, res) => {
    try {
        const userList = await userTable.find({});
        const formattedUserList = await Promise.all(userList.map(async user => {
            const userTests = await testsubmitTable.find({ userId: user._id });
            let totalQuestions = 0;
            let totalCorrectAnswer = 0;
            let totalWrongAnswer = 0;

            userTests.forEach(test => {
                test.questions.forEach(question => {
                    totalQuestions++;
                    if (question.selectedOption === question.correctOption) {
                        totalCorrectAnswer++;
                    } else {
                        totalWrongAnswer++;
                    }
                });
            });

            const percentage = (totalCorrectAnswer / totalQuestions) * 100 || 0;

            return {
                username: user.userName,
                useremail: user.email,
                totalTest: userTests.length,
                totalQuestions,
                totalCorrectAnswer,
                totalWrongAnswer,
                percentage
            };
        }));

        res.status(200).json({
            status: App_Status.Success, 
            message: "User list retrieved successfully",
            data: formattedUserList
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: error
        });
    }
}


//1.admin user na data joae shake and user potana data joae shake and userlist api ma 
//2.admin token thi Access karshe
//3.token thi id find karshe and admin table thi data lavshe ke admin che
//4.user token thi access karshe
//5.user token id find karshe and user table thi data lavshe

//1.Admin can view user's data and user can view own data and provide userlist
//2.Admin will access with token
//3.Token this id find last and save data in admin table after admin
//4.user will access with token
//5.User Token ID Find Last and User Table Data Last

module.exports = {
    loginAdmin,
    userlist
}

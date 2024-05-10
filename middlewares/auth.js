const jwt = require("jsonwebtoken");
const App_Status = require("../contact/contact");
const adminTable = require("../models/Admin");
const userTable = require("../models/user");
const dotenv = require("dotenv").config();


// const authMiddleware = async (req, resp, next) => {
//     const authHeader = req.header('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return resp.status(401).send({
//             Status: App_Status.Failed,
//             message:"Unauthorized. Missing or invalid token."
//         });
//     }
//     const token = authHeader.replace('Bearer ', '');
//     try {
//         const data = jwt.verify(token, process.env.SECRET_KEY);
//         const admin = await adminTable.findById(data.id);
//         if (!admin) {
//             return resp.status(403).send({
//                 Status: App_Status.Failed,
//                 message: "Forbidden. You are not an admin."
//             });
//         }
//         req.userid = data.id;
//         next();
//     } catch (error) {
//         resp.status(401).send({
//             Status:App_Status.Failed,
//             message:"Invalid credentials"
//         });
//     }
// };

const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: App_Status.Failed,
            message: "Unauthorized. Missing or invalid token."
        });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const data = jwt.verify(token, process.env.SECRET_KEY);
        const admin = await adminTable.findById(data.id);
        if (admin) {
            req.userId = data.id;
            next(); 
        } else {
            const user = await userTable.findById(data.id);
            if (!user) {
                return res.status(403).json({
                    status: App_Status.Failed,
                    message: "Forbidden. User not found."
                });
            }
        
            if (req.params._id && req.params._id !== user._id.toString()) {
                return res.status(403).json({
                    status: App_Status.Failed,
                    message: "Forbidden. You are not authorized to access this resource."
                });
            }
            req.userId = data.id;
            next(); 
        }
    } catch (error) {
        res.status(401).json({
            status: App_Status.Failed,
            message: "Invalid credentials"
        });
    }
};



//when user token enter that time show data otherwise getting message your are not admin

module.exports = authMiddleware;

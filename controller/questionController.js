const App_Status = require("../contact/contact");
const questionTable = require("../models/question");
const multer = require("multer");
const testTable = require("../models/test");

const storage = multer.diskStorage({
    destination: function (request, file, cb) {
        cb(null, 'public/profile');
    },
    filename: function (request, file, cb) {
        cb(null, file.fieldname + "_" + Math.floor((Math.random() * 10) + 1) + Date.now() + ".jpg");
    }
});

const upload = multer({ storage: storage });

const question = async (req, resp) => {
    const {
        question,
        question_ur,
        option_A,
        option_A_ur,
        option_B,
        option_B_ur,
        option_C,
        option_C_ur,
        option_D,
        option_D_ur,
        correctOption
    } = req.body;

    if (!option_A || !option_A_ur || !option_B || !option_B_ur) {
        return resp.status(400).json({ 
            Status: App_Status.Failed,
            message: "At least two options (option_A and option_B) are required",
            data: null
        });
    }

    const trimmedQuestion = question.trim();
    try {
        const questionCheck = await questionTable.findOne({ question: trimmedQuestion });
        if (questionCheck) {
            return resp.status(400).json({
                status: App_Status.Failed,
                message: "Question already exists",
                data: null
            });
        }
        const newQuestionOption = new questionTable({
            question: trimmedQuestion,
            question_ur,
            option_A,
            option_A_ur,
            option_B,
            option_B_ur,
            option_C,
            option_C_ur,
            option_D,
            option_D_ur,
            correctOption
        });
        if (req.file) {
            newQuestionOption.image = req.file.filename;
        }

        const savedQuestionOption = await newQuestionOption.save();

        resp.status(200).json({
            status: App_Status.Success,
            message: "Question added successfully",
            data: savedQuestionOption
        });
    } catch (error) {
        resp.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const questionList = async (req, resp) => {
    try {
        const questionList = await questionTable.find();
        const token = req.header('Authorization').replace('Bearer ', '');
        resp.status(200).json({
            Status: App_Status.Success,
            message: "Question List",
            data: questionList
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const editquestion = async (req, resp) => {
    try {
        const { _id } = req.query;
        console.log(req.query);
        let { question, question_ur, option_A, option_A_ur, option_B, option_B_ur, option_C, option_C_ur, option_D, option_D_ur, correctOption } = req.body
        const questionId = await questionTable.findById(_id);
        if (!questionId) {
            return resp.status(404).json({
                Status: App_Status.Failed,
                message: 'Question not found',
                data: null
            });
        }
        let theUserobj = {
            question: question,
            question_ur: question_ur,
            option_A: option_A,
            option_A_ur: option_A_ur,
            option_B: option_B,
            option_B_ur: option_B_ur,
            option_C: option_C,
            option_C_ur: option_C_ur,
            option_D: option_D,
            option_D_ur: option_D_ur,
            image: req.file ? req.file.filename : null,
            correctOption: correctOption
        }
        theUserobj = await questionTable.findByIdAndUpdate(_id, { $set: theUserobj }, { new: true })
        return resp.status(200).json({
            status: App_Status.Success,
            message: "Question update SuccessFully",
            data: theUserobj
        })
    } catch (error) {
        return resp.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: null
        })
    }
}

// const deletequestion = async(req,resp)=>{
//     try {
//         const { _id } = req.query;
//         const question = await questionTable.findById(_id);
//         if (!question) {
//             return resp.status(404).json({
//                 Status: App_Status.Failed,
//                 message: 'Question not found',
//                 data: null
//             });
//         }
//         await questionTable.findByIdAndDelete(_id);
//         resp.json({
//             Status: App_Status.Success,
//             message: 'Question deleted successfully',
//             data: null
//         });
//     } catch (error) {
//         resp.status(500).json({
//             Status: App_Status.Failed,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }

const deletequestion = async (req, resp) => {
    try {
        const { _id } = req.query;

        const testWithQuestion = await testTable.findOne({ questionId: _id });
        if (testWithQuestion) {
            return resp.status(400).json({
                Status: App_Status.Failed,
                message: 'Question cannot be deleted because it is referenced in a test',
                data: null
            });
        }

        const question = await questionTable.findById(_id);
        if (!question) {
            return resp.status(404).json({
                Status: App_Status.Failed,
                message: 'Question not found',
                data: null
            });
        }

        await questionTable.findByIdAndDelete(_id);
        resp.json({
            Status: App_Status.Success,
            message: 'Question deleted successfully',
            data: null
        });
    } catch (error) {
        resp.status(500).json({
            Status: App_Status.Failed,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

// const deletequestion = async (req, resp) => {
//     try {
//         const { _id } = req.query;
//         const question = await questionTable.findById(_id);
//         if (!question) {
//             return resp.status(404).json({
//                 Status: App_Status.Failed,
//                 message: 'Question not found',
//                 data: null
//             });
//         }

//         const testsContainingQuestion = await testTable.find({ questionId: _id });
//         if (testsContainingQuestion.length > 0) {
//             await Promise.all(testsContainingQuestion.map(async (test) => {
//                 test.questionId = test.questionId.filter(id => id.toString() !== _id);
//                 await test.save();
//             }));
//         }
//         await questionTable.findByIdAndDelete(_id);

//         resp.json({
//             Status: App_Status.Success,
//             message: 'Question deleted successfully',
//             data: null
//         });
//     } catch (error) {
//         resp.status(500).json({
//             Status: App_Status.Failed,
//             message: "Internal Server Error",
//             error: error.message
//         });
//     }
// }

//when admin send token so user's data get give me middlware and auth code
module.exports = {
    question,
    upload,
    questionList,
    editquestion,
    deletequestion
}
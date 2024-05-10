const { ObjectId } = require("bson");
const App_Status = require("../contact/contact");
const testTable = require("../models/test");
const testsubmitTable = require("../models/testsubmit");
const questionTable = require("../models/question");


const test = async (req, resp) => {
    try {
        const { testName, questionId, time } = req.body;
        if (!questionId || !Array.isArray(questionId) || questionId.length === 0) { 
            return resp.status(400).json({
                status: App_Status.Failed,
                message: 'questions must be a non-empty array',
                data: null
            });
        }
        const trimmedTestName = testName.trim();
        const testNameCheck = await testTable.findOne({ testName: trimmedTestName });
        if (testNameCheck) {
            return resp.status(400).json({
                status: App_Status.Failed,
                message: 'Test Name Already Exist',
                data: null
            });
        }

        const test = new testTable({ testName: trimmedTestName, questionId, time });
        const save = await test.save();

        resp.status(200).json({
            status: App_Status.Success,
            message: 'Test added successfully',
            data: save
        });
    } catch (err) {
        resp.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: err.message
        });
    }
}

const testedit = async (req, resp) => {
    try {
        const { testId, testName, questionId, time } = req.body;

        if (!testId) {
            return resp.status(400).json({
                status: App_Status.Failed,
                message: 'Test ID is required for editing',
                data: null
            });
        }

        if (!ObjectId.isValid(testId)) {
            return resp.status(400).json({
                status: App_Status.Failed,
                message: 'Invalid Test ID format',
                data: null
            });
        }


        const existingTest = await testTable.findById(testId);

        if (!existingTest) {
            return resp.status(404).json({
                status: App_Status.Failed,
                message: 'Test not found',
                data: null
            });
        }
        if (testName) {
            existingTest.testName = testName.trim();
        }
        if (questionId && Array.isArray(questionId) && questionId.length > 0) {
            existingTest.questionId = questionId;
        }
        if (time) {
            existingTest.time = time;
        }
        const updatedTest = await existingTest.save();

        resp.status(200).json({
            status: App_Status.Success,
            message: 'Test updated successfully',
            data: updatedTest
        });
    } catch (err) {
        resp.status(500).json({
            status: App_Status.Failed,
            message: "Internal Server Error",
            data: err.message
        });
    }
}


// const testsave = async (req, resp) => {
//     try {
//         const userId = req.userid;
//         const { testId, questions } = req.body;

//         if (!testId || !userId || !questions) {
//             return resp.status(400).json({
//                 Status: "Failed",
//                 message: "Invalid data provided",
//                 data: null
//             });
//         }

//         const newUserAnswer = new testsubmitTable({
//             testId,
//             userId,
//             questions,
//         });

//         await newUserAnswer.save();

//         const testResponses = await testsubmitTable.find({ userId });

//         if (!testResponses || !testResponses.length) {
//             return resp.status(404).json({
//                 Status: "Failed",
//                 message: "Test responses not found for the user",
//                 data: null
//             });
//         }

//         let totalTest = testResponses.length;
//         let totalQuestion = 0;
//         let totalCorrectAnswer = 0;

//         testResponses.forEach(response => {
//             totalQuestion += response.questions.length;
//             response.questions.forEach(question => {
//                 if (question.seleteAnswer === question.correctAnswer) {
//                     totalCorrectAnswer++;
//                 }
//             });
//         });

//         const totalWrongAnswer = totalQuestion - totalCorrectAnswer;
//         const percentage = (totalCorrectAnswer / totalQuestion) * 100;

//         resp.status(201).json({
//             Status: "Success",
//             message: "User Answer Added Successfully",
//             data: newUserAnswer,
//             totalTest,
//             totalQuestion,
//             totalCorrectAnswer,
//             totalWrongAnswer,
//             percentage
//         });
//     } catch (error) {
//         resp.status(500).json({
//             Status: "Failed",
//             message: "Internal Server Error: " + error.message,
//             data: null
//         });
//     }
// };

// const testsave = async (req, resp) => {
//     try {
//         const { testId, questions } = req.body;

//         if (!testId || !questions) {
//             return resp.status(400).json({
//                 Status: "Failed",
//                 message: "Invalid data provided",
//                 data: null
//             });
//         }

//         const newUserAnswer = new testsubmitTable({
//             testId,
//             userId: req.userid,
//             questions,
//         });

//         const savedUserAnswer =await newUserAnswer.save();

//         const totalQuestion = questions.length;
//         let totalCorrectAnswer = 0;

//         for (const question of questions) {
//             const { correctOption } = await questionTable.findById(question.questionId);
//             if (question.seleteOption === correctOption) {
//                 totalCorrectAnswer++;
//             }
//         }

//         const responseData = {
//             ...savedUserAnswer.toObject(),
//             questions: savedUserAnswer.questions.map(question => ({
//                 questionId: question.questionId,
//                 seleteOption: question.seleteOption
//             }))
//         };

//         const totalWrongAnswer = totalQuestion - totalCorrectAnswer;
//         const percentage = (totalCorrectAnswer / totalQuestion) * 100;

//         resp.status(201).json({
//             Status: "Success",
//             message: "User Answer Result Successfully",
//             data: responseData,
//             totalQuestion,
//             totalCorrectAnswer,
//             totalWrongAnswer,
//             percentage
//         });
//     } catch (error) {
//         resp.status(500).json({
//             Status: "Failed",
//             message: "Internal Server Error: " + error.message,
//             data: null
//         });
//     }
// };

const testresult = async (req, resp) => {
    try {
        const { testId, questions } = req.body;

        if (!testId || !questions) {
            return resp.status(400).json({
                Status: App_Status.Failed,
                message: "Invalid data provided",
                data: null
            });
        }

        const newQuestions = [];
        for (const question of questions) {
            const { correctOption } = await questionTable.findById(question.questionId);
            newQuestions.push({
                questionId: question.questionId,
                seleteOption: question.seleteOption,
                correctOption: correctOption 
            });
        }

        const newUserAnswer = new testsubmitTable({
            testId,
            userId: req.userid,
            questions: newQuestions, 
        });

        const savedUserAnswer = await newUserAnswer.save();

        const totalQuestion = newQuestions.length;
        let totalCorrectAnswer = 0;

        for (const question of newQuestions) {
            if (question.seleteOption === question.correctOption) {
                totalCorrectAnswer++;
            }
        }


        const totalWrongAnswer = totalQuestion - totalCorrectAnswer;
        const percentage = (totalCorrectAnswer / totalQuestion) * 100;

        resp.status(201).json({
            Status: App_Status.Success,
            message: "User Answer Result Successfully",
            data: savedUserAnswer,
            totalQuestion,
            totalCorrectAnswer,
            totalWrongAnswer,
            percentage
        });
    } catch (error) {
        resp.status(500).json({
            Status: App_Status.Failed,
            message: "Internal Server Error: " + error.message,
            data: null
        });
    }
};

const totalTestCount = async (req, resp) => {
    try {
        const userId = req.userid;

        if (!userId) {
            return resp.status(400).json({
                Status: App_Status.Failed,
                message: "Invalid data provided",
                data: null
            });
        }

        const testResponses = await testsubmitTable.find({ userId });

        if (!testResponses || !testResponses.length) {
            return resp.status(404).json({
                Status: App_Status.Failed,
                message: "Test responses not found for the user",
                data: null
            });
        }
        let totalTest = testResponses.length;
        resp.status(201).json({
            Status: App_Status.Success,
            message: "Total test count retrieved successfully",
            totalTest
        });
    } catch (error) {
        resp.status(500).json({
            Status: App_Status.Failed,
            message: "Internal Server Error: " + error.message,
            data: null
        });
    }
};

const testdelete = async (req, resp) => {
    try {
        const { _id } = req.query;

        const testWithSubmit = await testsubmitTable.findOne({ testId: _id });
        if (testWithSubmit) {
            return resp.status(400).json({
                Status: App_Status.Failed,
                message: 'Test cannot be deleted because it is referenced in a test',
                data: null
            });
        }

        const test = await testTable.findById(_id);
        if (!test) {
            return resp.status(404).json({
                Status: App_Status.Failed,
                message: 'Test not found',
                data: null
            });
        }

        await testTable.findByIdAndDelete(_id);
        resp.json({
            Status: App_Status.Success,
            message: 'Test deleted successfully',
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

module.exports = {
    test,
    testedit,
    testresult,
    totalTestCount,
    testdelete
}

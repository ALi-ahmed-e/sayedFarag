const router = require("express").Router();
const fs = require('fs').promises; // Use promises for asynchronous file operations
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const xlsx = require('xlsx');
const User = require('../models/userModel');
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleWare");




// add lessons or comp exams


router.post('/upload-excel-cheat', roleMiddleware, authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const updatePromises = data.map(async (user) => {
            let updateData;
            if (user.deg) {
                updateData = {
                    $push: {
                        comprehensiveExams: {
                            name: user.name,
                            sig: user.sig,
                            deg: user.deg,
                            date: new Date().toISOString(),
                        },
                    },
                };
            } else {
                const booleanValue = user.hw || user.hw.toLowerCase() === "true";
                const booleanValue2 = user.attended || user.attended.toLowerCase() === "true";

                updateData = {
                    $push: {
                        lessons: {
                            hw: booleanValue,
                            sig: user.sig,
                            exam: user.exam,
                            location: user.location,
                            date: new Date().toISOString(),
                            attendance: booleanValue2,
                        },
                    },
                };
            }

            await User.findOneAndUpdate({ phoneNumber: user.phoneNumber }, updateData).exec();
        });



        // Wait for all updates to complete before deleting the file
        data[0].deg ? await Promise.all([...updatePromises]) : await Promise.all([...updatePromises])

        // data[0].deg? await Promise.all([...updatePromises, ...addLessonPromises]):await Promise.all([...updatePromises])

        // Remove the file after processing
        await fs.unlink(filePath);

        res.status(200).json('done');
    } catch (error) {
        await fs.unlink(req.file.path);

        console.error(error);
        res.status(500).json('An error occurred');
    }
});

// add lessons with excel sheet

// the route i want let me call it test
router.post('/upload-excel-sheet-students', roleMiddleware, authMiddleware, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const existedUsers = []

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const updatePromises = data.map(async (user) => {





            const fuser = await User.findOne({phoneNumber: user['رقم الطالب']})

            if (fuser) existedUsers.push({
                name: user['الاسم'],
                phoneNumber: user['رقم الطالب'],
                parentPhoneNumber: user['رقم ولي الامر'],
                group: user['المجموعه'],
                level: user['المرحله الدراسيه'],
            })


            createdUser = await User.create({
                name: user['الاسم'].toLowerCase(),
                phoneNumber: user['رقم الطالب'],
                parentPhoneNumber: user['رقم ولي الامر'],
                group: user['المجموعه'],
                level: user['المرحله الدراسيه'],
                role: "طالب",
                createdAt: new Date().toLocaleString('en-US', { timeZone: 'Africa/Cairo' }),
            })



        });


        // Wait for all updates to complete before deleting the file
        await Promise.all([...updatePromises])

        // data[0].deg? await Promise.all([...updatePromises, ...addLessonPromises]):await Promise.all([...updatePromises])

        // Remove the file after processing
        await fs.unlink(filePath);

        console.log(existedUsers)

        res.status(200).json('done');
    } catch (error) {
        await fs.unlink(req.file.path);

        console.error(error.message);
        res.status(500).json('An error occurred');
    }
});





module.exports = router;

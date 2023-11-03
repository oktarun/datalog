const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Main = require('../models/main');
const Table = require('../models/table');
const Workerprofile = require('../models/workerprofile');
const { ifError } = require('assert');
const { type } = require('os');
const mongoose = require('mongoose');


// to compare two object, using t compare /present to check if user realy present
async function areObjectsEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) {
            return false;
        }
    }

    return true;
}


router.post('/', async (req, res) => {                   // first router like excel page type

    res.end()
    return;


    try {

        const { xValue, yValue, input, doc_id } = req.body;
        console.log(xValue, yValue, input, doc_id);
        i = 1
        // if (i == 1) { res.json(200,`i think we got ${doc_id}`) }
        // else {
        const yNewValue = parseInt(yValue) + 1;   // to leave one top of array for some other info
        Table.findById(doc_id, function (err, doc) {
            if (err) {
                console.log(err)
            }
            else {





                // cod = doc
                // cod.name[xValue] = doc.name[xValue]
                // cod.name[xValue][yValue]= parseInt(input)
                // console.log(cod)
                cod = doc.name[yNewValue];
                console.log(yNewValue, xValue)
                cod[xValue] = input;
                doc.name[yNewValue] = cod;
                doc.save(function (err, updatedDoc) {
                    if (err) {
                        console.log(err)
                        res.end()
                    } else {
                        console.log(updatedDoc.name)
                        // res.json(updatedDoc.name)
                        res.json(updatedDoc.name[yNewValue][xValue])
                    }
                })
            }
        })

        // }
    } catch (error) {
        res.json("i think we didnt get docid")

    }
});



router.get('/data:doc_id', async (req, res) => {
    doc_id = req.params.doc_id
    console.log(doc_id)

    Table.findById(doc_id, function (err, doc) {
        if (err) {
            console.log(err)
        }
        else {

            // console.log(doc.name);
            res.json(doc.name);
        }
    })
});


router.post('/addworker', async (req, res) => {


    const session = await mongoose.startSession();
    session.startTransaction();
    console.log("session started")

    try {
        const { doc_id, worker_id, worker_name } = req.body;
        const current_login_user_id = req.userid;
        const row = [{ detail: [worker_id, worker_name], attendance: [], payment: [] }, current_login_user_id, new Date()];

        // Step 1: Find the document
        const doc = await Table.findById(doc_id)

        // doc.name = doc.name.filter(item => item !== null);
        console.log("doc got find with session", doc)

        // Step 2: Check if the worker already exists
        const existingWorkerIndex = doc.name.findIndex((line, loc) => {
            if (loc === 0 || loc === 1) {
                return false;
            }
            console.log(line)
            return line[0].detail[0] === worker_id;
        });
        console.log(existingWorkerIndex)

        if (existingWorkerIndex !== -1) {
            await session.abortTransaction();
            session.endSession();
            res.json({ status: 220, message: "Document already Exist", payload: existingWorkerIndex });
            return; // Exit early if the worker exists
        }


        // Step 3: Add the new worker to the document
        doc.name.push(row);

        // Step 4: Save the updated document

        const savedDoc = await doc.save();
        console.log(savedDoc);



        // Step 5: Update the worker's data
        const workerDoc = await Workerprofile.findById(worker_id).session(session);
        console.log(workerDoc)

        if (workerDoc) {
            workerDoc.data.push(doc_id);
            await workerDoc.save();
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        // Step 6: Send a response indicating success
        res.json({ status: 200, message: "Document saved successfully", payload: savedDoc });
    } catch (error) {
        // Handle errors and roll back the transaction
        console.log(error)
        await session.abortTransaction();
        session.endSession();
        res.json({ status: 400, message: "Something error happened", payload: error });
    }



    // const tableUpdateQuery = {
    //     $push: {
    //         name: row
    //     }
    // };

    // Table.findByIdAndUpdate(doc_id, tableUpdateQuery, { new: true }, (err, updatedDoc) => {
    //     if (err) {
    //         console.log(err);
    //         res.end();
    //     } else {
    //         console.log(updatedDoc);

    //         // Define the update query for WorkerProfile model
    //         const workerProfileUpdateQuery = {
    //             $push: {
    //                 data: [doc_id, updatedDoc.name.length - 1]
    //             }
    //         };

    //         Workerprofile.findByIdAndUpdate(worker_id, workerProfileUpdateQuery, { new: true }, (err, updatedProfile) => {
    //             if (err) {
    //                 console.log(err);
    //                 res.end();
    //             } else {
    //                 console.log(updatedProfile);
    //                 res.end();

    //             }
    //         });
    //     }
    // });

});




router.post("/present", async (req, res) => {

    const { yValue, doc_id } = req.body;
    const current_login_user_id = req.userid;

    // Convert yValue to an integer (assuming it represents the index)
    const yIndex = parseInt(yValue) + 1;


    // ..define the data
    const data = {
        user_id: current_login_user_id,
        date: new Date(),
    }
    // Define the update operation
    const updateOperation = {
        $push: {
            // Construct the field path dynamically based on the index (yIndex)
            [`name.${yIndex}.0.attendance`]: data,
        },
    };

    // Execute the update operation
    Table.findOneAndUpdate(                                         // changes query to not return new doc to save server
        { _id: doc_id }, // Specify the document to update by _id
        updateOperation,
        { new: true }, // This option returns the modified document 
        function (err, result) {
            if (err) {
                console.log("Error updating document:", err);
                return res.json({status:400, message: "Database error" });
            }
            if (!result) {
                // Handle the case where the document is not found
                return res.json({status:400, message: "Document not found, refresha dnc check it", });
            }



            today = new Date(result.name[yIndex][0].attendance.at(-1).date);
            yesterday = new Date(result.name[yIndex][0].attendance.at(-2) ? result.name[yIndex][0].attendance.at(-2).date : "gibberish bitch 76342");
            alreadyP = yesterday.getDate() === today.getDate() && yesterday.getMonth() === today.getMonth() && yesterday.getFullYear() === today.getFullYear() ? true : false;
            console.log(today, yesterday, alreadyP);

            if (alreadyP) {
                return res.json({status:400, message:"attendance marked two times for same day, tell the Tarun"});
                // call middlware for yourself doc_id and result.name[yIndex][0].attendance
            }
            console.log(result.name[yIndex][0].attendance.at(-1), data)
            if (areObjectsEqual(result.name[yIndex][0].attendance.at(-1), data)) {


                return res.json({ status: 200, message: "Attendance Marked succesFully" });
            }



        }
    );




});

// to add payment
// 

router.post("/pay", async (req, res) => {
    const user_id = req.userid;
    const { yValue, doc_id, amount } = req.body;
    const yFirNewValue = parseInt(yValue) + 1;

    try {
        const updatedDoc = await Table.findByIdAndUpdate(
            doc_id,
            {
                $push: {
                    [`name.${yFirNewValue}.0.payment`]: {
                        user_id: user_id,
                        amount: amount,
                        date: new Date()
                    }
                }
            },
            { new: true }
        );

        if (!updatedDoc) {
            res.json({status:400, message:  'Doc not found' })
            return 
        }

        console.log(updatedDoc.name);
        res.json({status:200, message:`Paid`});
    } catch (err) {
        console.error(err);
        res.json({status:400, message:  'Internal server error' })
    }
});
// add dihaadi
router.post("/dihaadi", async (req, res) => {
    if(req.userAbility !="admin") return;
    

    const { value, doc_id } = req.body;

    // Convert the value to a number
    const parsedValue = parseInt(value);

    Table.findOneAndUpdate(
        { _id: doc_id },
        {
            $push: {
                'name.0.3': parsedValue,
            },
        },
        { new: true }, // This option returns the modified document
        (err, updatedDoc) => {
            if (err) {
                console.log(err);
                return res.json({status:400, message: "Database error" });
            }

            if (!updatedDoc) {
                return res.json({status:400, message: "Document not found" });
            }

            console.log("Document updated successfully");
            console.log(updatedDoc);
            res.json({status:200, message: "Dihaadi Set" });
            // return

        }
    );




});



// for kharcha

router.post("/addReason", async (req, res) => {
    const { inputAmount, inputReason, doc_id, tableType } = req.body;

    const user_id = req.userid;

    row = { amount: inputAmount, reason: inputReason, user_id: user_id, date: new Date() };
    Table.findById(doc_id, function (err, doc) {

        doc.name.push(row);

        doc.save(function (err, updatedDoc) {

            if (err) {
                console.log(err)
        
                res.json({status:400, message: "Err happened"})
            } else {
                console.log(updatedDoc.name)
                res.json({status:200, message: "Reason Added"})
            }


        });




    });









    console.log("addReason ", req.body);
    // res.json("Right tableType ");
    // res.json("contact me, something worng with main.js router or you mf did something bad");
});



// router.get("/totalAmount", async (req, res) => {
//     aLL = {};
//     const Tables = await Table.find({}).exec();     // fetch table later from server itself using midlware
//     Tables.forEach(element => {
//         let total = 0;
//         tab = element.name;
//         tab.forEach((line, loc) => {
//             if (loc == 1 || loc == 2) {

//             }
//             else {
//                 line[0].payment.forEach(paid => {

//                     total += parseInt(paid.amount)
//                 });

//             }


//         });

//         index = aLL.findIndex(gram => gram.name === tab[0][0]);
//         if(index !== -1){
//             newgram = {name : tab[0][0], list0:[], list1:[], list2:[], list3:[]}
//             propertyName = `list${tab[0][1]}`
//             newgram[propertyName].push(total);

//             aLL.push(newgram)


//         }else{

//             propertyName = `list${tab[0][1]}`
//             all[index][propertyName].push(total)

//         }


//     });
//     res.json(aLL)
// })

router.get("/totalAmount", async (req, res) => {
    try {
        const Tables = await Table.find({}).exec();
        const aLL = [];

        Tables.forEach(element => {
            let total = 0;
            const tab = element.name;
            if (tab[0][1] === 3) {

                tab.forEach((line, loc) => {
                    console.log(line, loc)
                    if (loc !== 0 && loc !== 1) {
                        console.log(loc, line)
                        total += parseInt(line.amount)
                        
                    }
                });

            }
            else {

                tab.forEach((line, loc) => {
                    console.log(line, loc)
                    if (loc !== 0 && loc !== 1) {
                        console.log(loc)
                        line[0].payment.forEach(paid => {
                            console.log(paid)
                            total += parseInt(paid.amount);
                        });
                    }
                });
            }

            const index = aLL.findIndex(gram => gram.name === tab[0][0]);
            const propertyName = `list${tab[0][1]}`;

            if (index !== -1) {
                //   if (!aLL[index][propertyName]) {
                //     aLL[index][propertyName] = [];
                //   }
                aLL[index][propertyName].push(total);
            } else {
                const newgram = {
                    name: tab[0][0],
                    list0: [],
                    list1: [],
                    list2: [],
                    list3: []
                };
                newgram[propertyName] = [total];
                aLL.push(newgram);
            }
        });

        res.json(aLL);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});




module.exports = router;
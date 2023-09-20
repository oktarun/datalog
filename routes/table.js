const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Main = require('../models/main');
const Table = require('../models/table');
const Workerprofile = require('../models/workerprofile');
const { ifError } = require('assert');
const { type } = require('os');
const mongoose = require('mongoose');



router.post('/', async (req, res) => {


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

    const { doc_id, worker_id, worker_name } = req.body;
    current_login_user_id = "fiuewbifbsdbfbsdkjfbdskjbf"
    row = [{ detail: [worker_id, worker_name], attendance: [], payment: [] }, current_login_user_id, new Date()];

    const tableUpdateQuery = {
        $push: {
            name: row
        }
    };

    Table.findByIdAndUpdate(doc_id, tableUpdateQuery, { new: true }, (err, updatedDoc) => {
        if (err) {
            console.log(err);
            res.end();
        } else {
            console.log(updatedDoc);

            // Define the update query for WorkerProfile model
            const workerProfileUpdateQuery = {
                $push: {
                    data: [doc_id, updatedDoc.name.length - 1]
                }
            };

            Workerprofile.findByIdAndUpdate(worker_id, workerProfileUpdateQuery, { new: true }, (err, updatedProfile) => {
                if (err) {
                    console.log(err);
                    res.end();
                } else {
                    console.log(updatedProfile);
                    res.end();

                }
            });
        }
    });

});



router.post("/present", async (req, res) => {

    const { yValue, doc_id } = req.body;
    const current_login_user_id = "fiuewbifbsdbfbsdkjfbdskjbf";

    // Convert yValue to an integer (assuming it represents the index)
    const yIndex = parseInt(yValue) + 1;

    // Define the update operation
    const updateOperation = {
        $push: {
            // Construct the field path dynamically based on the index (yIndex)
            [`name.${yIndex}.0.attendance`]: {
                user_id: current_login_user_id,
                date: new Date(),
            },
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
                return res.status(500).json({ error: "Database error" });
            }
            if (!result) {
                // Handle the case where the document is not found
                return res.status(404).json({ error: "Document not found" });
            }

            console.log(result.name[yIndex][0].attendance);
            // return res.json("dsgdf");
            Yablw = result;
            // console.log(Yablw);
        }
    );




});

// to add payment
router.post("/paying", async (req, res) => {

    const { yValue, doc_id, payment } = req.body;
    const current_login_user_id = "fiuewbifbsdbfbsdkjfbdskjbf";

    // Convert yValue to an integer (assuming it represents the index)
    const yIndex = parseInt(yValue) + 1;

    // Define the update operation
    const updateOperation = {
        $push: {
            // Construct the field path dynamically based on the index (yIndex)
            [`name.${yIndex}.0.payment`]: {
                user_id: current_login_user_id,
                amount: payment,
                date: new Date(),
            },
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
                return res.status(500).json({ error: "Database error" });
            }
            if (!result) {
                // Handle the case where the document is not found
                return res.status(404).json({ error: "Document not found" });
            }

            console.log(result.name[yIndex][0].payment);
            // return res.json("dsgdf");
            Yablw = result;
            // console.log(Yablw);
        }
    );




});

// add dihaadi
router.post("/dihaadi", async (req, res) => {

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
                return res.status(500).json({ error: "Database error" });
            }

            if (!updatedDoc) {
                return res.status(404).json({ error: "Document not found" });
            }

            console.log("Document updated successfully");
            console.log(updatedDoc);

            return res.json(updatedDoc);
        }
    );




});

router.post("/pay", async (req, res) => {
    const user_id = "fiuewbifbsdbfbsdkjfbdskjbf";
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
            return res.status(404).json({ error: 'Document not found' });
        }

        console.log(updatedDoc.name);
        res.json(updatedDoc.name[yFirNewValue][0].payment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/addReason", async (req, res) => {
    const { inputAmount, inputReason, doc_id, tableType } = req.body;

    const user_id = "fiuewbifbsdbfbsdkjfbdskjbf";

    row = { amount: inputAmount, reason: inputReason, user_id: user_id, date: new Date() };
    Table.findById(doc_id, function (err, doc) {

        doc.name.push(row);

        doc.save(function (err, updatedDoc) {

            if (err) {
                console.log(err)
                res.end()
            } else {
                console.log(updatedDoc.name)
                res.json(updatedDoc.name)
            }


        });




    });









    console.log("addReason ", req.body);
    // res.json("Right tableType ");
    // res.json("contact me, something worng with main.js router or you mf did something bad");
});




module.exports = router;
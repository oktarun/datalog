const express = require('express');
const router = express.Router();

const Workerprofile = require('../models/workerprofile');
const { profile } = require('console');
// const workerprofile = require('../models/workerprofile');




// router.use((err, req, res, next) => {
//     console.error(err.stack); // Log the error stack trace for debugging
//     res.status(500).send('Something went wrong!'); // Send a 500 Internal Server Error response
//   });


router.post('/', async (req, res) => {
    const { imagedata, name, father, age } = req.body;
    // console.log(imagedata, name, father, age);
    userId = req.userid;

    var profile = new Workerprofile();
    // Workerprofile.findById("650467ef920afa44603214ec", function (err, profile) {
    profile.name = name;
    profile.FathersName = father;
    profile.Age = age;
    profile.image = imagedata;
    profile.createdBy = userId;
    profile.save(function (err, updatedProfile) {
        if (err) {
            console.log(err)

            res.json({ status: 400, message: "Err happened" });
        } else {
            console.log(updatedProfile)
            res.json({ status: 200, message: "Saved Succesfully" });
        }
    });
    // });




});

router.get('/', async (req, res) => {
    res.render('page.ejs');
});


router.get('/profile:worker_id', async (req, res) => {   // here you chatgpt put a "/" after profile like this "/profile/:worker_id/" and thsa why it was not working
    try {
        const { worker_id } = req.params;
        console.log(worker_id)
        //   const response = await fetch(`http://localhost:80/workerprofile/profile/:${worker_id}`);
        //   if (!response.ok) {
        //     throw new Error('Network response was not ok');
        //   }
        //   const worker = await response.json();
        Workerprofile.findById(worker_id, function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                console.log(doc);
                res.json(doc);
            }
        });
        res.json(worker);
    } catch (error) {
        //   next(error); // Pass the error to the error handling middleware
    }
});


router.post("/profiles", async (req, res) => {
    console.log(req.params)
    searchString = req.body.searchString;
    ignoreCount = req.body.ignoreCount;
    limitCount = 5;
    console.log(searchString);

    if (searchString === "") {
        searchFor = {

        }

    } else {

        searchFor = {
            name: {
                $regex: searchString,
                $options: 'i' // Case-insensitive matching
            }
        }

    }


    Workerprofile.find(searchFor).skip(ignoreCount).sort({ name: 1 }).limit(limitCount).exec((err, matchingNameDoc) => {
        if (err) {
            console.error(err);
            return;
        }

        res.json({ data: matchingNameDoc, should: limitCount });

        console.log(matchingNameDoc.length);

    });


});







module.exports = router;
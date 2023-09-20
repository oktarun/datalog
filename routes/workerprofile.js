const express = require('express');
const router = express.Router();

const Workerprofile = require('../models/workerprofile');
// const workerprofile = require('../models/workerprofile');




// router.use((err, req, res, next) => {
//     console.error(err.stack); // Log the error stack trace for debugging
//     res.status(500).send('Something went wrong!'); // Send a 500 Internal Server Error response
//   });


router.post('/', async (req, res) => {
    const { imagedata, name, father, age } = req.body;
    // console.log(imagedata, name, father, age);

    profile = new Workerprofile();
    // Workerprofile.findById("650467ef920afa44603214ec", function (err, profile) {
        profile.name = name;
        profile.FathersName = father;
        profile.Age = age;
        profile.image = imagedata;
        profile.save(function (err, updatedProfile) {
            if (err) {
                console.log(err)
                res.end()
            } else {
                console.log(updatedProfile)
                res.end()
            }
        });
    // });




});

router.get('/', async (req, res) => {
    res.render('page.ejs');
});


router.get('/profile:worker_id', async (req, res, next) => {   // here you chatgpt put a "/" after profile like this "/profile/:worker_id/" and thsa why it was not working
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


router.post("/profile", async (req, res) => {
    console.log(req.params)
    searchString = req.body.searchString;
    ignoreCount = req.body.ignoreCount;
    limitCount = 10;
    console.log(searchString)


    Workerprofile.find({
        // name: {
        //     $regex: searchString,
        //     $options: 'i' // Case-insensitive matching
        // }
    }).skip(ignoreCount).sort({ name: 1 }).limit(limitCount).exec((err, matchingNameDoc) => {
        if (err) {
            console.error(err);
            return;
        }
        res.json(matchingNameDoc);

        console.log(matchingNameDoc.length);

    });


});







module.exports = router;
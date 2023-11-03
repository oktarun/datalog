const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const Main = require('../models/main');
const Table = require('../models/table');

const {updateMain, getMain} = require('../middleware/mainMiddleware');
// const { name } = require('ejs');
// const Maina = require('../models/main')(req.body.maina);
mAdd = "64df883a5c2b2661708d6910";

const { getUser } = require('../middleware/authMiddleware');
const { get } = require('http');


// router.get('/', async (req, res) => {
//   res.render('body.ejs');
// });

router.get('/data', async (req, res) => {
// if admin send this
if(req.userAbility ==="admin"){
  var main = await getMain();
  res.json(main);
}
  // Main.findById(mAdd, function (err, doc) {
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     res.json(doc.name)
  //   }
  // });
  //else create anew doc.name from user.main
  

  else{

    user = getUser(req.userid);

    res.json(user.main)



    

  }



});



// router.post('/b', async (req, res) => {
// res.render('body.ejs');    // am i hallaucinating or is this the same as the bottom one. yo, bro gpt you quite more than ecpected and quite less too. but reall good hehehehehehehehehehehehehehhhehehehehehehehehehhhhhhehhhhhhhhhhhhhhhhhhehhhhhhehehheheheheheehhehehehehehehehehehehehehehhehehhhehehhehehehhehhehehhhehhehhehehehh. looks like other its more common than i think.
// });



router.post('/a', async (req, res) => {

  if(req.userAbility !="admin") return;
  Main.findById(mAdd, async function (err, doc) {
    if (err) {
      // res.status(500).send(err);
       res.json({status:400, message: "Something happened ERR"})

    } else {
      var value = req.body.maina;
      //   dog = [[value]]
      // doc.name[0]= [value]   // to reset the value
      cod = []
      cod.push(value);

      // Create an array to store all the promises
      const promises = [];
      TableTypeInOrder = ["Worker", 'Driver', 'Fitter', 'Kharcha']

      // create blank table document 4 times push it in main document and then push it's id in the table document;
      for (var z = 0; z < 4; z++) {    // worker driver fitter kharcha
        const blankDocument = new Table();
        // for (var x = 0; x < 10; x++) {                             // to create a 2d array by chatgpt, usefull for table
        //   var row = [];
        //   for (var y = 0; y < 20; y++) {
        //     // Assign some value to the cell
        //     row.push(null);

        //   };


        //   blankDocument.name.push(row);
        // };

        // to add some additonal data on top array of table
        if (z  == 3) {
          row1 = [value, z, 2, []]
          row2 = ["Date", "Reason", "Amount"];
        }
        else{
        row1 = [value, z, 4, []];                     

        row2 = ["Name", "No. of days", "Total Payment", "Paid", "Due"];}
        blankDocument.name.push(row1);
        blankDocument.name.push(row2);




        // Save the blank document to the database
        const savePromise = await blankDocument.save()
          .then(savedDocument => {
            const id = savedDocument._id;
            cod.push({type: TableTypeInOrder[z], id:id});
            console.log(id);
          });
        promises.push(savePromise);

      }
      // Wait for all promises to resolve
      Promise.all(promises)
        .then(() => {
          doc.name.push(cod);
          // doc.name = [];
          
          doc.save(function (err, updatedDoc) {
            if (err) {
              console.log(err);
              res.status(500).send(err);
            } else {
              console.log(updatedDoc);
              // res.status(200).send(updatedDoc);
              
              updateMain(updatedDoc.main);
              res.json({status:200, message: "Added a New Gram"})
            }
          });
        });
    }
  })

  
});

// turn of the below router and add it in router/a by iterating 4 time and creating those files


// router.post('/b', async (req, res) => {

//   // Create a new instance of the model with only the default _id field
//   const blankDocument = new Table();
//   for (var x = 0; x < 10; x++) {                             // to create a 2d array by chatgpt, usefull for table
//     var row = [];
//     for (var y = 0; y < 20; y++) {
//       // Assign some value to the cell
//       row.push(null);

//     }


//     blankDocument.name.push(row);
//   }


//   // Save the blank document to the database
//   blankDocument.save()
//     .then(savedDocument => {
//       // Extract the _id field
//       const id = savedDocument._id;
//       const value = req.body.value; // Assuming "value" is the key in req.body

//       Main.findById(mAdd, function (err, doc) {
//         if (err) {
//           res.status(500).send(err);
//         } else {
//           // Find the correct nested array and push an object with value and _id
//           const cod = doc.name[1]; // Assuming name[1] is the correct nested array
//           cod.push({ value: value, _id: id }); // Push object with both value and _id

//           // Save the updated document
//           doc.save(function (err, updatedDoc) {
//             if (err) {
//               console.log(err);
//               res.json(err);
//             } else {
//               console.log(updatedDoc);
//               res.json("updatedDoc");
//             }
//           });
//         }
//       });
//     })
//     .catch(error => {
//       console.error("Error saving blank document:", error);
//     });
// });






module.exports = router;
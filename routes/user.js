const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_CONST = "TG^$3vT^5rb7r%^R56 r%^f   6tr 56r65r 56rf56F %^4161hg 4c6 tT%^^EY$ "

const User = require('../models/user');

const { requireAuth, requireAdminAbility, updateUser, getUser } = require('../middleware/authMiddleware');

const { getMain } = require('../middleware/mainMiddleware.js');


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(typeof username, password);
    // console.log(!isNaN(parseFloat(username)) , isFinite(username))

    let user;

    if (isFinite(username)) {
        user = await User.findOne({ mobileNo: username });
    }
    if (typeof username === String) {
        user = await User.findOne({ name: username });
    }
    console.log(user);

    if (!user) {

        res.json({ status: 400, message: "user not found" });
        console.log("user not found");

    }

    else if (await bcrypt.compare(password, user.psd)) {

        const token = jwt.sign({ id: user._id }, JWT_CONST);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        // res.json({ user: user._id });
        res.json({ status: 200, message: "Loggined Succesfully" });
        console.log("user found");

        updateUser(user);
    }


});

router.get('/logout', (req, res) => {
    const token = "";
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    // res.json({ status: 200, message: "user logged out" });
    // res.render('login');
    res.redirect("/")

});

// router.get('/blank', (req, res) => {

//     res.render("blank");
// });



router.use(requireAuth);

router.get('/me', (req, res) => {

    var user = getUser(req.userid);
    


    res.json({ status: 200, payload: user })
    // console.log("/me final");


})



router.use(requireAdminAbility);

router.get('/add', (req, res) => {
    res.render('signup');
});

router.get('/access', (req, res) => {
    console.log("/access start")
    User.find({}).exec((err, allUsers) => {

        if (err) {
            console.log(err);
        }
        else {
            console.log(allUsers, "all users");
            // res.json(allUsers);

            // res.render('access', {data: allUsers});     // was when using ejs renderer to render but changed to calling at /user/accounts
            res.render('access');
        }


    });
});



router.post('/signup', async (req, res) => {
    console.log("singing up");
    console.log(req)
    const { username, password, mobileNo } = req.body;

    // hashed_psd = await bcrypt.hash("1234567890", 10)

    const user = new User();


    // user.name = "Tarun";
    // user.userLevel = "admin";
    // user.psd = hashed_psd;
    // user.mobileNo = "6545785965";

    user.name = username;
    user.userLevel = "regular";
    user.psd = await bcrypt.hash(password, 10);
    user.mobileNo = mobileNo;

    user.save(function (err, updatedUser) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            console.log(updatedUser);
            res.end();
        }

    });
});

router.get('/accounts', (req, res) => {
    let allUsers = []
    User.find({}).exec((err, userS) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(userS)
            userS.forEach(user => {
                user.psd = null
                if (user.userLevel !== "admin") {

                    allUsers.push(user)
                }
                

            });
            
            res.json(allUsers);
        }


    });
    
    




});





router.post('/_main', async (req, res) => {

    const { user } = req.body;
    // console.log(user);
    // res.json("got it boy, main");

    // var main = await getMain();
    // newMain= [];


    User.findById(user.id, function (err, doc) {


        if (err) {
            console.log(err)
        }
        else {
            // console.log(doc);
            doc.main = user.main;
            // count = 0;
            // user.main.forEach(mai => {
            //     if (mai) {
            //         newMain.push(main[count]);

            //     }

            //     count++;

            // });
            // doc.main = newMain;



            // console.log(doc)
            doc.save(function (err, updatedDoc) {
                if (err) {
                    console.log(err)
                
                    res.json({status: 400, message : `Err Happened`});
                } else {
                    updateUser(updatedDoc);
                    // console.log(updatedDoc)
                    res.json({status: 200, message : `Updated List Succesfully for ${updatedDoc.name}`});
                }
            });



        }


    });


});

















module.exports = router;
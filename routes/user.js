const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_CONST = "TG^$3vT^5rb7r%^R56 r%^f   6tr 56r65r 56rf56F %^4161hg 4c6 tT%^^EY$ "

const User = require('../models/user');

const { requireAuth, requireAdminAbility, updateUser } = require('../middleware/authMiddleware');

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
        res.json({ status: 200, message: "user found" });
        console.log("user found");

        updateUser(user);
    }


});

router.get('/logout', (req, res) => {
    const token = "";
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    // res.json({ status: 200, message: "user logged out" });
    res.render('login');

});



router.use(requireAuth, requireAdminAbility);




router.get('/add', (req, res) => {
    res.render('signup');
});

router.get('/access', (req, res) => {
    User.find({}).exec((err, allUsers) => {
        
        if (err) {
            console.log(err);
        }
        else {
            console.log(allUsers, "all users");
            // res.json(allUsers);
       
            res.render('access', {data: allUsers});
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

    User.find({}).exec((err, allUsers) => {

        if (err) {
            console.log(err);
        }
        else {
            console.log(allUsers, "all users");
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
                    res.end()
                } else {
                    updateUser(updatedDoc);
                    // console.log(updatedDoc)
                    res.json(updatedDoc)
                }
            });



        }


    });


});

















module.exports = router;
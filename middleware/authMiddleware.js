const jwt = require('jsonwebtoken');
const JWT_CONST = "TG^$3vT^5rb7r%^R56 r%^f   6tr 56r65r 56rf56F %^4161hg 4c6 tT%^^EY$ ";

const User = require('../models/user');

var allUsers = [];

function requireAuth(req, res, next) {
    token = req.cookies.jwt;
    console.log(token)
    // console.log('This is middleware', req.originalUrl);
    if (token) {
        jwt.verify(token, JWT_CONST, async (err, decodedToken) => {
            if (err) {
                // res.redirect("/auth")
                res.render('login');
            } else {


                // // Make req.userData read-only
                // Object.defineProperty(req, 'userData', {
                //     value: Object.freeze(decodedToken),
                //     writable: false,
                //     enumerable: true,
                // });
                console.log(decodedToken)
                // console.log(allUsers)

                var user = allUsers.find(user => user.id === decodedToken.id);
                // console.log(user);
                if (user) {
                    // req.userAbility = "admin";
                    req.userAbility = user.userLevel;
                    req.userid = decodedToken.id;
                    next();
                }
                else {
                    next();
                    return;
                  
                    
                    
                    // const token = "";
                    // res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
                    res.render('login');
                }
            }
        })
    }
    else {
        // res.redirect("/auth")
        res.render('login');
    }
};





 function updateUser(userData) {
    userData.psd = null;


    // console.log("update user called", userData);

    const index = allUsers.findIndex(user => user.id === userData.id);
    if (index !== -1) {
        // User with the specified ID was found at index 'index'
        // const foundUser = allUsers[index];
        allUsers[index] = userData;
        console.log(`User found at index ${index}:`, allUsers[index]);
    } else {
        // User with the specified ID was not found
        allUsers.push(userData);
        console.log('User not found ', ' And poushed the user');
    }
    // console.log(allUsers);


};

function getUser(id) {

    var user = allUsers.find(user => user.id === id);
    // console.log(user)
    return user;


}

function requireAdminAbility(req, res, next) {

    if (req.userAbility === "admin") {

        next();

    } else {
        res.json("you dont have enough permission");
    }



}


module.exports = { requireAuth, updateUser, requireAdminAbility, getUser };
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const upload = require('express-fileupload');
const fs = require('fs');
var path = require('path');
const workerprofile = require('./routes/workerprofile.js');
const main = require('./routes/main.js');
const table = require('./routes/table.js');
const user = require('./routes/user.js');
const User = require('./models/user');
const Main = require('./models/main.js');
const { updateMain } = require('./middleware/mainMiddleware.js');

const { requireAuth, updateUser } = require('./middleware/authMiddleware.js');
const { readyBackupAndSendOne } = require('./middleware/mailer.js');



// for live reload
// var livereload = require("livereload");
// var connectLiveReload = require("connect-livereload");
// const liveReloadServer = livereload.createServer();
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 10);
// });
// app.use(connectLiveReload());


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));
app.use(cookieParser());
app.use(upload());

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://cardioisgood:noncardioisgood@cluster0.uynrtks.mongodb.net/bread?retryWrites=true&w=majority', {
    useNewUrlParser: true
});
mongoose.set('strictQuery', false);
const db = mongoose.connection
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to mongoose'));


// stroing state of server
var state = false;  // chang eit to false during deployment
// add a mahaDev router only you can acces to put server into brick state to pass no more req, so can close server safely
app.get("/MahaDev/Chela/dev/Tarun/Ki/JayHo/Motu/Patlu:value", function (req, res) {  // either verify for user or make the URL more complicated

    let change;
    const maValue = req.params.value;
    console.log(maValue)
    if (maValue === ":false") {
        state = false
        change = "Changed to"
    }
    else if (maValue === ":true") {
        state = true
        change = "Changed to"
    }
    else {
        change = "WTF is this value, No change happen, state is as it was "
    }

    res.json({ status: 200, message: `${change} ${state}` })

});
app.use((req, res, next) => {
    console.log("checking state of ", state)
    if (state) {
        console.log("state ", state, " continue for next");
        next()    // continue the req
    }
    if (!state) {
        console.log("state ", state, " server will not accpet req");
        res.json("server is in reparing mod, will accept no req");
        return;
    }
});

app.get("/favicon.ico", (req, res) => {
    console.log("favicon req detected")
    const faviconPath = path.join(__dirname, 'favicon.png');
    res.sendFile(faviconPath);
});
// to avoid concurrency if concurrency happen simply rerun the router with same req, best and effective method threee to four times
// add a middleware which wil run on concurrency occur. it will simmply add an req.retry parameter and re run the router with some time gap each time inc the req.retry
// when req.retry will hit limit, error will happen and send to frontend to unsucesful and a error will be saved into error for me
// i dont think there is any need for concurrecny 
// chance of concurrecny in this is none
// coz only i person will manage one databse. coz off of them ae physically present updation. so if two people are phsysically at one place only one will do not both of them
// or simply store the databse state too, like when running a databse change req change databse state to false, so no req will continue for that databse obejct
// and after completing the changes, change state to true
// each changing req for databse will check its state in localVariable and return if false or wait it to be true by looping it checking state or adding event listener to that variable
// and continue if true
// BUT ANY WAY IN THIS PROJECT THERE IS NO CHANCE OF CONCURRECNY AS EVERYTHING WILL BE HAPPEN BY PHYSCIALLY PRESENT AT POST AND ALSO ONLY ONCE PERSON WILL BE RESPONSIBLE FOR ONE DATABSE
// NO NEED TO ADD CONCURRECNY SAFETY MODE
// CHILL OUT AND SM

app.use('/user', user);
app.use(requireAuth);
app.use("/mailer", readyBackupAndSendOne);
// app.use('/', workerprofile);
app.get('/', (req, res) => {
    res.render('body.ejs');
});
app.use('/main', main);
app.use('/table', table);
app.use('/workerprofile', workerprofile);


// at last to catch trash url
app.get(URL, function (req, res) {
    // console.log(URL)

    // lost

    res.redirect("/");
});


app.listen(process.env.PORT || 80, async () => {

    try {
        const mainDoc = await Main.findById("64df883a5c2b2661708d6910").exec();
        if (!mainDoc) {
            throw new Error("Main document not found");
        }
        updateMain(mainDoc.name);
        console.log(`Server started at ${process.env.PORT || 80}`, "And main updated");

        const allUsers = await User.find({}).exec();
        // console.log(allUsers, "all users");
        allUsers.forEach(user => {         // auto login all userin server, else even if jwt is prenet in the cache, if user not find in sever allUser sever will erase user cache ad ask to login again
            updateUser(user);
        });
        console.log("ready")

        state = true;
    } catch (err) {
        console.error(err);
        // res.status(500).send(err);
    }


});
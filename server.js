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


app.use('/user', user);
app.use(requireAuth);
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
        console.log(allUsers, "all users");
        allUsers.forEach(user => {
            updateUser(user);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }


});
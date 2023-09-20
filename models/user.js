const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userLevel:{
        type: String,
    },
    psd:{
        type: String,
        required: true
    },
    mobileNo:{
        type: Number,

    },
    main: {
        type: Array
    }
    
});

module.exports = mongoose.model("userProfile", userSchema)

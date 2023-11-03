const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const workerprofileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    FathersName: { 
        type: String
    },
    Age: {
        type: Date
    },
    image:{
        type: String
    },
    data: {
        type: Array
    },
    createdBy :{
        type : String
    }
    
});

module.exports = mongoose.model("workerprofile", workerprofileSchema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tableSchema = new mongoose.Schema({
    name: {
        type: Array
    }
    // customKeys: Schema.Types.Mixed
});

// module.exports = (modelName) => mongoose.model(modelName, orderSchema);
module.exports = mongoose.model("table", tableSchema); 
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mainSchema = new mongoose.Schema({
    name: {
        type: Array
    }
    // customKeys: Schema.Types.Mixed
});

module.exports = mongoose.model("main",mainSchema)


// fro passing name of databse also
// module.exports = (modelName) => mongoose.model(modelName, orderSchema);

  // const newDoc = await Main.create({ [req.body.maina]: [] });
  // const newDoc = new MainaModel({ name: [] });
  // await newDoc.save();

  // await Main.updateOne(
  //     { /* query */ },
  //     { $push: { name: 'new element' } }
  // );
  // const documentId = "64df890eaf2df6c5d5922681";

  // const result = await Main.updateOne(
  //     { _id: ObjectId(documentId) },
  //     { $set: { name: ["fjgjfcbhb"] } }
  // );
const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const movieSchema = new Schema({
    comments: { type: String },
    userClassification: { type: Number },
    movieDbId: { type: Number },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = model("Movie", movieSchema);

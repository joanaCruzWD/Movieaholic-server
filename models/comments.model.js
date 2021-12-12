const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const commentSchema = new Schema({
    body: { type: String },
    username: { type: String },
    favoriteId: { type: Number }
});

module.exports = model("Comment", commentSchema);

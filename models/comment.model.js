const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const commentSchema = new Schema({
    body: { type: String },
    username: { type: String },
    userId: { type: String },
    favoriteId: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = model("Comment", commentSchema);

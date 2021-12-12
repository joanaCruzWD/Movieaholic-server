const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const favoriteSchema = new Schema({
    _id: { type: Number },
    userId: [{ type: String }],
}, { _id: false }

);

module.exports = model("Favorite", favoriteSchema);


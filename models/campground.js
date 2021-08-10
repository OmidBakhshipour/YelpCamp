const mongoose = require("mongoose");
// Shorthand for Schema
const Schema = mongoose.Schema;

const CampgroudSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String,
});

module.exports = mongoose.model("Campground", CampgroudSchema);

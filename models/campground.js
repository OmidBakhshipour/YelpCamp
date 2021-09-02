const mongoose = require("mongoose");
// Shorthand for Schema
const Schema = mongoose.Schema;

const CampgroudSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

module.exports = mongoose.model("Campground", CampgroudSchema);

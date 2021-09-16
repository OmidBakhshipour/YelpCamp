const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
    console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // Your user ID
            author: "6139062f8addbf4670f369fe",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur, porro ullam quasi saepe enim repellat.",
            price,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude],
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dtaofi2me/image/upload/v1631473090/YelpCamp/pboso9vnbqevanx9hzjt.jpg",
                    filename: "YelpCamp/pboso9vnbqevanx9hzjt",
                },
                {
                    url: "https://res.cloudinary.com/dtaofi2me/image/upload/v1631473095/YelpCamp/kwhz5vit3rmzh1zgifro.jpg",
                    filename: "YelpCamp/kwhz5vit3rmzh1zgifro",
                },
            ],
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get(
    "/",
    catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res, next) => {
        // req.body : {"campground":{"title":"something","location":"something", ...}}
        // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "Succesfully made a new campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const { id } = req.params;
        /*
        const campground = await Campground.findById(id).populate("reviews").populate("author");
        Here the author is the campground's author, we want the author of each review.
        What should we do? Nested populate. down below
        */
        const campground = await Campground.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("author");
        // Telling first populate the reviews and their authors, then populate the campground's author.
        if (!campground) {
            req.flash("error", "No Campground Found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash("error", "No Campground Found");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(
            id,
            req.body.campground
        );
        req.flash("success", "Succesfully updated campground");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted campground");
        res.redirect("/campgrounds");
    })
);

module.exports = router;

const express = require('express');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

const router = express.Router();



// List all campgrounds:
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds });
}));

// Create new campground:
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {    
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show page:
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

//Edit page:
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete one campground:
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;

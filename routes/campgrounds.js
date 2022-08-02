const express = require('express');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');

const router = express.Router();

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(d => d.message).join(', ');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

// List all campgrounds:
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('./campgrounds/index', { campgrounds });
}));

// Create new campground:
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});
router.post('/', validateCampground, catchAsync(async (req, res) => {    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully created a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Show page:
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

//Edit page:
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

//Delete one campground:
router.delete('/:id', catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect('/campgrounds');
}));

module.exports = router;

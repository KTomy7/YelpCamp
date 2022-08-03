const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

const router = express.Router();

// Register:
router.get('/register', (req, res) => {
    res.render('users/register');
});
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

// Login:
router.get('/login', (req, res) => {
    res.render('users/login');
});
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
});

// Logout:
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
});

module.exports = router;

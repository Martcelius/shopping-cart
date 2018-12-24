var express = require('express');
var Product = require('../model/product');
var Order = require('../model/order');
var Cart = require('../model/cart');
var csrf = require('csurf');
var csrfProtection = csrf();
var passport = require('passport');

var router = express.Router();

router.use(csrfProtection);

router.get('/profile', isLogin, (req, res, next) => {
    Order.find({
        user: req.user.id
    }, (err, orders) => {
        var cart;

        orders.forEach(order => {
            cart = new Cart(order.cart);
            order.items = cart.changetoArray();
            // console.log(order.items);
        });


        res.render('users/profile', {
            newOrder: orders
        });
    });

});

router.get('/logout', isLogin, (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

router.use('/', notLogin, (req, res, next) => {
    next();
});

router.get('/signup', (req, res, next) => {
    var message = req.flash('error');
    res.render('users/signup', {
        title: 'Sign Up ',
        csrfToken: req.csrfToken(),
        messages: message,
        hasErrors: message.length > 0
    });
});

router.get('/signin', (req, res, next) => {
    var message = req.flash('error');
    res.render('users/signin', {
        title: 'Signin',
        csrfToken: req.csrfToken(),
        messages: message,
        hasErrors: message.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }

});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }

});

module.exports = router;

function isLogin(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}

function notLogin(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
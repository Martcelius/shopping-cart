var express = require('express');
var Product = require('../model/product');
// var csrf = require('csurf');
// var csrfProtection = csrf();
var passport = require('passport');
var Cart = require('../model/cart');
var shopController = require('../controller/shop');
var Order = require('../model/order');

var router = express.Router();

// router.use(csrfProtection);

/* GET home page. */
router.get('/', function (req, res, next) {
  shopController.allData(req, res, next);

});

router.get('/add_cart/:id', (req, res, next) => {
  var productId = req.params.id;
  Product.findById(productId, (err, item) => {
    if (err) {
      res.redirect('/');
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {
      items: {},
      totalQty: 0,
      totalPrice: 0
    });
    cart.add(item, item._id);
    req.session.cart = cart;
    // console.log(req.session.cart.items);
    res.redirect('/');
  });
});

router.get('/reduceOne/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {
    items: {},
    totalQty: 0,
    totalPrice: 0
  });
  cart.reduceOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping_cart');
});

router.get('/reduceAll/:id', function (req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {
    items: {},
    totalQty: 0,
    totalPrice: 0
  });
  cart.reduceAll(productId);
  req.session.cart = cart;
  res.redirect('/shopping_cart');
});

router.get('/shopping_cart', (req, res, next) => {
  if (!req.session.cart) {
    return res.render('shop/shopping_cart', {
      product: null
    });
  };
  var cart = new Cart(req.session.cart);
  // console.log(cart.changetoArray());
  res.render('shop/shopping_cart', {
    product: cart.changetoArray(),
    totalPrice: cart.totalPrice
  });
});

router.get('/checkout', isLogin, (req, res, next) => {
  if (!req.session.cart) {
    res.redirect('/shopping_cart');
  };
  var errorMsgs = req.flash('error')[0];
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {
    total: cart.totalPrice,
    errorMsg: errorMsgs,
    noError: !errorMsgs,
  });
});

router.post('/checkout', isLogin, (req, res, next) => {
  if (!req.session.cart) {
    res.redirect('/shopping_cart');
  };

  var cart = new Cart(req.session.cart);
  var stripe = require('stripe')("sk_test_zGASFDzSlTbw77zHup0Y224m");
  stripe.charges.create({
    amount: cart.totalPrice * 100,
    currency: "usd",
    source: req.body.stripeToken, // obtained with Stripe.js
    description: "Test Charge"
  }, function (err, charge) {
    if (err) {
      req.flash('error', err.message);
      res.redirect('/checkout');
    }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address,
      name: req.body.name,
      paymentId: charge.id
    });
    order.save((err, docs) => {
      req.flash('success', 'Successfully bought product');
      req.session.cart = null;
      res.redirect('/');
    })

  });
})

module.exports = router;

function isLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  };
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
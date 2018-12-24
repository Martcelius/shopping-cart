var Product = require('../model/product');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/shopping", {
    useNewUrlParser: true
});


var products = [
    new Product({
        imagePath: '/images/download (2).jpg',
        title: 'Grey',
        description: 'This is a best film ever',
        price: 90
    }),
    new Product({
        imagePath: '/images/download (3).jpg',
        title: 'The Hunger Games',
        description: 'Best seller movie and book in the world',
        price: 20
    }),
    new Product({
        imagePath: '/images/download.jpg',
        title: 'Harry potter',
        description: 'For the potter fans',
        price: 15
    }),
    new Product({
        imagePath: '/images/images.jpg',
        title: 'End of Watching',
        description: 'The greates book ever',
        price: 10
    }),
    new Product({
        imagePath: '/images/51PhzoS9YiL._SX330_BO1,204,203,200_.jpg',
        title: 'American Sniper',
        description: 'Legend army in USA ',
        price: 30
    }),
];

var done = 0;

products.forEach((items) => {
    items.save((err, doc) => {
        done++;
        if (done === items.length) {
            exit();
        }
    })
});

function exit() {
    mongoose.disconnect();
};
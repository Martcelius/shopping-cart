var Product = require('../model/product');
module.exports = {

    allData: function (req, res, next) {
        var success = req.flash('success')[0];
        Product.find((err, docs) => {
            var productChunk = [];
            var chunkSize = 3;
            for (let i = 0; i < docs.length; i += chunkSize) {
                productChunk.push(docs.slice(i, i + chunkSize));
            };
            res.render('shop/index', {
                title: 'Index Shopping ',
                products: productChunk,
                successMsg: success,
                noSuccess: !success
            });
            // console.log(docs);
        });

    },
}
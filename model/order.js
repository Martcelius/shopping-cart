var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cart: {
        type: Object,
        require: true
    },
    address: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Order', schema);
// @ts-nocheck
module.exports = function Cart(oldcart) {
    this.items = oldcart.items;
    this.totalQty = oldcart.totalQty;
    this.totalPrice = oldcart.totalPrice;

    this.add = function (item, id) {
        var storeItem = this.items[id];
        if (!storeItem) {
            var storeItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
        }
        storeItem.qty++;
        storeItem.price = storeItem.item.price * storeItem.qty;
        this.totalQty++;
        this.totalPrice += storeItem.item.price;
    };

    this.reduceOne = function (id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalPrice -= this.items[id].item.price;
        this.totalQty--;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        };
    };

    this.reduceAll = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.changetoArray = function () {
        var itemsArray = [];
        for (const id in this.items) {
            itemsArray.push(this.items[id]);
        }
        return itemsArray;
    }


};
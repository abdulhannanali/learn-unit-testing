const tax = require('./tax')

function CartSummary (items) {
    this._items = items
}

CartSummary.prototype.getSubtotal = function (initialSub) {
    if (this._items && this._items.length) {
        if (!initialSub) {
            initialSub = 0
        }
        
        return this._items.reduce((subtotal, item) => {
            return subtotal + (item.price * item.quantity)
        }, initialSub)
    }

    return 0
}

CartSummary.prototype.getTax = function (state, done) {
    tax.calculate(this.getSubtotal(), state, function (taxInfo) {
        done(taxInfo.amount)
    })
}

module.exports = CartSummary
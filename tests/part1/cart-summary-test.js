const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect

const CartSummary = require('../../src/part1/cart-summary.js')
const tax = require('../../src/part1/tax')

describe('CartSummary', function () {
    it('getSubtotal() should return 0 if no items are passed in', () => {
        const cartSummary = new CartSummary()
        expect(cartSummary.getSubtotal()).to.equal(0)
    })

    it('getSubtotal()  should return the sum of the price * quantity of all items', function () {
        const cartItems = ([
            {
                id: 1,
                quantity: 4,
                price: 50
            },
            {
                id: 2,
                quantity: 3,
                price: 313
            },
            {
                id: 3,
                quantity: 123,
                price: 2133
            }
        ])
        const cartSummary = new CartSummary(cartItems)
        const subtotal = cartItems.reduce((previousPrice, item) => previousPrice + (item.price * item.quantity), 0)
        
        expect(cartSummary.getSubtotal()).to.equal(subtotal)
    })
})

describe('getTax()', function () {
    beforeEach(function () {
        sinon.stub(tax, 'calculate', function (subtotal, state, done) {
            process.nextTick( () => done({
                amount: 30
            }))
        })
    })

    it('should execute the callback function with the tax amount', function (done) {
        const cartItems = ([
            {
                id: 1,
                quantity: 4,
                price: 50
            },
            {
                id: 2,
                quantity: 3,
                price: 313
            },
            {
                id: 3,
                quantity: 123,
                price: 2133
            }
        ])

        const cartSummary = new CartSummary(cartItems)
        cartSummary.getTax('NY', function (taxAmount) {
            expect(taxAmount).to.equal(30)
            expect(tax.calculate.getCall(0).args[0]).to.equal(263498)
            expect(tax.calculate.getCall(0).args[1]).to.equal('NY')
            expect(typeof tax.calculate.getCall(0).args[2]).to.equal('function')
            done()
        })
    })

    afterEach(function () {
        tax.calculate.restore()
    })
})
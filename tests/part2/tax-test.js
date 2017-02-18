const nock = require('nock')
const expect = require('chai').expect
const tax = require('../../src/part2/tax')

describe('Tax', function () {
   it('calculate() should resolve containing an object with tax details', function (done) {
       nock('https://some-tax-service.com')
        .post('/request')
        .reply(200, function (uri, requestBody) {
            return ({
                amount: requestBody.subtotal * 0.10
            })
        })
        
        tax.calculate(500, 'CA', function (taxDetails) {
            expect(taxDetails).to.eql({ amount: 50 })
            done()
        })
    })
})
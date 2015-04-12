var expect = require('chai').expect
var BabyHint = require('../src/babyhint')

/* Definitions for JS Standard */
/* global describe, it */

describe('BabyHint', function () {
  it('should get an object', function (done) {
    console.log(BabyHint)
    expect(BabyHint).to.be.an('object')
    done()
  })
})

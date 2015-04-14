var expect = require('chai').expect
var fs = require('fs')
var BabyHint = require('../src/babyhint')
var fixtures
/* Definitions for JS Standard */
/* global describe, it, beforeEach*/

describe('BabyHint', _describe.BabyHint)
function _beforeEachFixtures (done){
  fs.readdir('./fixtures', function _afterFixturesReaddir(err, files){

  })
}
var _describe = {
  babyHint: function _describeBabyHint () {
    beforeEach(_beforeEachFixtures)
    it('should get an object', _test.object)
    describe('babyErrors', _describe.babyError)
  },
  babyError: function _describeBabyError () {
    it('should return errors on problems', _test.babyError.positive)
    it('should not return errors when no problems', _test.babyError.negative)
  }
}
var _test = {
  object:function _testObject (done) {
    console.log(BabyHint)
    expect(BabyHint).to.be.an('object')
    done()
  },
  babyError:{
    positive:function _testBabyErrorPositive (done) {
      console.log(BabyHint)
      expect(BabyHint).to.be.an('object')
      done()
    },
    negative:function _testBabyErrorNegative (done) {
      console.log(BabyHint)
      expect(BabyHint).to.be.an('object')
      done()
    }
  }
}

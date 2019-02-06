var GameOfLife = require('../lib/GameOfLife')
var expect = require('chai').expect;

describe('main.generateVirginMap', () => {

    it('should return an array', () => {
      var result = main.generateVirginMap();

      expect(result).to.be.array()

  })

})
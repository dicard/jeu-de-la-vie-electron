const GameOfLife = require('../lib/GameOfLife')
const chai = require('chai');
const assertArrays = require('chai-arrays');
const assertInteger = require('chai-integer');

let expect = chai.expect;
chai.use(assertArrays);
chai.use(assertInteger)

describe('generateEmptyMap', () => {

  it('should return an  array', () => {
    var template = GameOfLife.generateEmptyTemplate()

    expect(template).to.be.array()
  });

  it('should return an 2d array', () => {
    var height = 8, 
        width = 14;

    var template = GameOfLife.generateEmptyTemplate(width, height);

    expect(template).to.be.ofSize(height);
    expect(template[0]).to.be.ofSize(width);
  });

  it('should fills each cell by 0', () => {
    var height = 13,
        width = 18;

    var template = GameOfLife.generateEmptyTemplate(width, height);

    for(var i = 0; i < height; i++){
      for(var j = 0; j < width; j++){
        var cell = template[i][j];
        var result = cell === 0;
        //eslint-disable-next-line
        expect(result).to.be.true;
      }
    }
  });
});

describe('generateRandomTemplate', () => {
  it('should return an array', () => {
    var template = GameOfLife.generateRandomTemplate();

    expect(template).to.be.array()
  });

  it('should return an 2d array', () => {
    var height = 15,
        width = 20;

    var template = GameOfLife.generateRandomTemplate(width, height);
    expect(template).to.be.ofSize(height);
    expect(template[0]).to.be.ofSize(width);
  });

  it('should fills each cell by 0 or 1', () => {
    var height = 10,
        width = 12;

    var template = GameOfLife.generateRandomTemplate(width, height);

    for(var i = 0; i < height; i++){
      for(var j = 0; j < width; j++){
        var cell = template[i][j];

        var result = cell === 0 || cell === 1;
        //eslint-disable-next-line
        expect(result).to.be.true;
      }
    }
  });
  
});

describe('newCellState', () => {
  it('should return an integer', () => {
    var aroundCell = [1, 1, 1, 0, 0, 0, 1, 0, 1];

    var newState = GameOfLife.newCellState(aroundCell);

    expect(newState).to.be.an.integer()
  })

  it('should return 1 when it\'s allive', () => {
    var aroundCells= [
      [1, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0]
    ];
    
    for (var i = 0; i < aroundCells.length; i++){
      var newState =GameOfLife.newCellState(aroundCells[i])
      expect(newState).to.equal(1);
    }
  });

  it('should return 0 when it\'s dead', () => {
    var aroundCells= [
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    
    for (var i = 0; i < aroundCells.length; i++){
      var newState =GameOfLife.newCellState(aroundCells[i])
      expect(newState).to.equal(0);
    }
  });

  it('should return current state as new state', () => {
    var aroundCells= [
      [1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 0, 0, 1, 1, 0, 0, 0]
    ];
      expect(GameOfLife.newCellState(aroundCells[0])).to.equal(0);
      expect(GameOfLife.newCellState(aroundCells[1])).to.equal(1);

  });
})

describe('findAroundCell', () => {
    this.template = [  
      [0, 1, 0, 1],
      [1, 0, 1, 0],
      [0, 1, 1, 0]
    ];

    it('should return an array', () => {
      var newTemplate = GameOfLife.findAroundCell(this.template, 1, 1);

      expect(newTemplate).to.be.array();
    });

    it('should return the cells around the cell at i, j', () => {
      var i = 1,
          j = 1; 
      
      var newTemplate = GameOfLife.findAroundCell(this.template, i, j)

      expect(newTemplate).to.be.equalTo([0, 1, 0, 1, 0, 1, 0, 1, 1]);
    })
})

describe('return the cells around a border\'s cell', () => {
  it('should work at the top line', () => {
    var i = 0,
        j = 2;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);

    expect(newTemplate).to.be.equalTo([1, 1, 0, 1, 0, 1, 0, 1, 0])
  });

  it('should work at the bottom line', () => {
    var i = 2,
        j = 2;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);

    expect(newTemplate).to.be.equalTo([0, 1, 0, 1, 1, 0, 1, 0, 1])
  });

  it('should work at the left column', () => {
    var i = 1,
        j = 0;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);

    expect(newTemplate).to.be.equalTo([1, 0, 1, 0, 1, 0, 0, 0, 1])
  });

  it('should work at the right column', () => {
    var i = 1,
        j = 3;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);

    expect(newTemplate).to.be.equalTo([0, 1, 0, 1, 0, 1, 1, 0, 0])
  });
});

describe('return the cells around a corner\'s cell', () => {
  it('should work on top left corner', () => {
    var i = 0,
        j = 0;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);
    expect(newTemplate).to.be.equalTo([0, 0, 1, 1, 0, 1, 0, 1, 0])
  });

  it('should work on bottom left corner', () => {
    var i = 2,
        j = 0;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);
    expect(newTemplate).to.be.equalTo([0, 1, 0, 0, 0, 1, 1, 0, 1])
  });

  it('should work on top right corner', () => {
    var i = 0,
        j = 3;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);
    expect(newTemplate).to.be.equalTo([1, 0, 0, 0, 1, 0, 1, 0, 1])
  });

  it('should work on bottom right corner', () => {
    var i = 2,
        j = 3;

    var newTemplate = GameOfLife.findAroundCell(this.template, i, j);
    expect(newTemplate).to.be.equalTo([1, 0, 1, 1, 0, 0, 0, 1, 0])
  });
})

describe('evolveTemplate',() => {
    var template = [
      [0,0,0,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,1,0,0],
      [0,0,0,0,0]
    ]
  it('should return an array', () => {
    var newTemplate = GameOfLife.evolveTemplate(template);

    expect(newTemplate).to.be.array();
  });

  it('should return an evolved array according to game of life rules', () => {
    var newTemplate = GameOfLife.evolveTemplate(template);

    expect(newTemplate[0]).to.be.equalTo([0,0,0,0,0]);
    expect(newTemplate[1]).to.be.equalTo([0,0,0,0,0]);
    expect(newTemplate[2]).to.be.equalTo([0,1,1,1,0]);
    expect(newTemplate[3]).to.be.equalTo([0,0,0,0,0]);
    expect(newTemplate[4]).to.be.equalTo([0,0,0,0,0]);
  })

})

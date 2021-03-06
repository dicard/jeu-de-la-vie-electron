//eslint-disable-next-line
module.exports = {
  //on cherche la ligne au dessu de la cellule
  topLine: (array, i, j) => {
    if(i > 0) {
      return module.exports.cellsInLine(array[i-1], j);
    }
    else {
      return module.exports.cellsInLine(array[array.length - 1], j)
    }
  },

  //en fonction des cellules autour de la cellule de départ on calcule son nouvel état
  newCellState: (aroundCell) => {
    var sum = aroundCell.reduce((a,b) => {return a + b});
    if(sum === 3) {
      return 1;
    }
    else if(sum === 4) {
      return aroundCell[4];
    }
    else {
      return 0;
    }
  },

  //on cherche la ligne de la cellule
  middleLine: (array, i, j) => {
    return module.exports.cellsInLine(array[i], j);
  },

  //generation d'une map vierge
  generateEmptyTemplate: (width, height) => {
    var template = new Array(height);
    for(var i = 0; i < height; i++) {
      template[i] = [];
      for(var j = 0; j < width; j++) {
        template[i][j] = 0;
      }
    }
    return template
  },

  //génération d'une nouvelle disposition de jeu aléatoire
  generateRandomTemplate: (width, height) => {
    var template = new Array(height);
      for(var i = 0; i < height; i++) {
       template[i]= [];
        for(var j = 0; j < width; j++) {
         template[i][j] = Math.floor(Math.random() * 2);
        }
      }
      return template;   
  },

  //on cherche les cellules voisines lignes par lignes et on fait communiquer la premiere et la deniere ligne pour avoir une grille torique
  findAroundCell: (array, i, j) => {  
    var cells = module.exports.topLine(array, i, j).concat(module.exports.middleLine(array, i, j), module.exports.bottomLine(array, i, j));
    
    return cells.map((cell) => {
      return cell ===undefined ? 0 : cell;
    });
  },
  
  //évolution du template selon les regles du jeu.
  evolveTemplate: (template) => {
    var evolvedTemplate = new Array(template.length);  

    for(var i = 0; i < template.length; i++) {
      evolvedTemplate[i] = new Array(template[i].length)
      for(var j = 0; j <template[i].length; j++) {
        var aroundCell = module.exports.findAroundCell(template, i, j);
        var state = module.exports.newCellState(aroundCell);
        evolvedTemplate[i][j] = state;
      }
  }
  
  return evolvedTemplate;
  },

  //on cherche les différentes cellules de la ligne
  cellsInLine: (line, j) => {
    var left = j - 1;
    var right = j + 1;
  
    if(j === 0) {
      left = line.length - 1;
    }
    else if(j === line.length - 1) {
      right = 0;
    }
  
    return [line[left], line[j], line[right]];
  },

  //on cherche la ligne en dessous de la cellule
  bottomLine: (array, i, j) => {
    if(i === array.length - 1) {
      return module.exports.cellsInLine(array[0], j);
    }
    else {
      return module.exports.cellsInLine(array[i+1], j);
    }
  }

}
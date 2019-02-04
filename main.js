const electron = require('electron');
const { ipcMain } = require('electron');
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

let mainWindow;

const createWindow = () => {

  mainWindow = new BrowserWindow({width: 1800, height: 1200});

  mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

//génération d'une nouvelle disposition de jeu aléatoire
generateRandomStart = (gridData) => {
  this.gameArray= new Array(gridData.height);

    for(var i = 0; i < gridData.height; i++) {
      this.gameArray[i]= [];
      for(var j = 0; j < gridData.width; j++) {
        this.gameArray[i][j] = Math.floor(Math.random() * 2);
      }
    }

    return this.gameArray;
    
};

//évolution du jeux
updateArray = () => {
  var tempArray = this.gameArray
  for(var i = 0; i< this.gameArray.length; i++) {
    for(var j = 0; j<this.gameArray[i].length; j++) {
      var arroundCell = findArroundCell(this.gameArray, i, j);
      tempArray[i][j] = newCellState(arroundCell)
    }
  }
  this.gameArray =tempArray;
  return this.gameArray;
};

//on cherche les cellules voisines lignes par lignes et on fait communiquer la premiere et la deniere ligne pour avoir une grille torique
findArroundCell = (array, i, j) => {
  var cells = topLine(array, i, j).concat(middleLine(array, i, j), bottomLine(array, i, j));

  return cells.map((cell) => {
    return cell ===undefined ? 0 : cell;
  });

};

topLine =(array, i, j) => {
  if(i > 0) {
    return cellsInLine(array[i-1], j);
  }
  else {
    return cellsInLine(array[array.length - 1], j)
  }
}

middleLine = (array, i, j) => {
  return cellsInLine(array[i], j);
}

bottomLine = (array, i, j) => {
  if(i === array.length -1) {
    return cellsInLine(array[0], j);
  }
  else {
    return cellsInLine(array[i+1], j);
  }
}

cellsInLine = (line, j) => {
  var left = j - 1;
  var right = j + 1;

  if(j === 0) {
    left = line.length - 1;
  }
  else if(j === line.length - 1) {
    right = 0;
  }

  return [line[left], line[j], line[right]];
}

newCellState = (arroundCell) => {
   var sum = arroundCell.reduce((a,b) => {return a + b}, 0);

   if(sum === 3) {
     return 1;
   }
   else if(sum === 4) {
     return arroundCell[4];
   }
   else {
     return 0;
   }
};


//ipc Things

ipcMain.on('new-game',(event, gridData) => {
  var gameArray = generateRandomStart(gridData);
  this.generationNbr = 1
  event.sender.send('generate-grid', gameArray,this.generationNbr);
})

ipcMain.on('generate-next',(event) => {
  this.updatedArray = updateArray();
  this.generationNbr ++;
  event.sender.send('generate-grid',this.updatedArray, this.generationNbr)
})

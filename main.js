const electron = require('electron');
const { ipcMain } = require('electron');
const app = electron.app;
const maps= require('./maps/maps');
const fs = require('fs');


const BrowserWindow = electron.BrowserWindow;

let mainWindow;
let currentMap = {};
let generationNbr = 0;
const createWindow = () => {

  mainWindow = new BrowserWindow({width: 1800, height: 1200});

  mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {    
    mainWindow.webContents.send('maps-options', maps);
  });


}

app.on('ready', createWindow);

//generation d'une map vierge
generateVirginMap = (mapData) => {
  var template = new Array(mapData.height);
    for(var i = 0; i < mapData.height; i++) {
      template[i] = [];
      for(var j = 0; j < mapData.width; j++) {
        template[i][j] = 0;
      }
    }
    return template
};




//évolution du template selon les regles du jeu.
evolveTemplate = (map) => {
  
  
  var evolvedTemplate = new Array(map.height);  

  for(var i = 0; i < map.height; i++) {
    evolvedTemplate[i] = new Array(map.width)
    for(var j = 0; j <map.width; j++) {
      var arroundCell = findArroundCell(map.template, i, j);
      var state = newCellState(arroundCell);
      evolvedTemplate[i][j] = state;
    }
  }
  
  return evolvedTemplate;
};

//on cherche les cellules voisines lignes par lignes et on fait communiquer la premiere et la deniere ligne pour avoir une grille torique
findArroundCell = (array, i, j) => {  
  var cells = topLine(array, i, j).concat(middleLine(array, i, j), bottomLine(array, i, j));
  
  return cells.map((cell) => {
    return cell ===undefined ? 0 : cell;
  });

};

//on cherche la ligne au dessu de la celule
topLine =(array, i, j) => {
  if(i > 0) {
    return cellsInLine(array[i-1], j);
  }
  else {
    return cellsInLine(array[array.length - 1], j)
  }
}

//on cherche la ligne de la celule
middleLine = (array, i, j) => {
  return cellsInLine(array[i], j);
}

//on cherche la ligne en dessous de la celule
bottomLine = (array, i, j) => {
  if(i === array.length - 1) {
    return cellsInLine(array[0], j);
  }
  else {
    return cellsInLine(array[i+1], j);
  }
}

//on cherche les différentes celules de la ligne
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

//en fonction des celules autour de la celule de départ on calcule son nouvel état
newCellState = (arroundCell) => {
   var sum = arroundCell.reduce((a,b) => {return a + b});
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

//on genere une nouvelle partie a partir d'une map existante
generateGameFromMap = (mapName) => {

  var map = maps.findIndex(x => x.name === mapName)
  return maps[map]
}

//génération d'une nouvelle disposition de jeu aléatoire
generateRandomMap = () => {
  var map = {};
  map.title = 'Aléatoire'
  map.width = 80;
  map.height = 40;
  map.generationNbr = 0;

  map.template = new Array(map.height);

    for(var i = 0; i < map.height; i++) {
      map.template[i]= [];
      for(var j = 0; j < map.width; j++) {
        map.template[i][j] = Math.floor(Math.random() * 2);
      }
    }

    return map;
    
};

saveNewMap = (map) => {
  maps.push(map)
  fs.writeFile('./maps/maps.json', JSON.stringify(maps), (error) => {
    if(error){
      console.log(error);
      if(fail) {
        fail(error);
      }
    }
    else {
      mainWindow.webContents.send('map-saved')
    }
  })
}

//ipcMain Listenner

// on ecoute  la création d'une nouvelle map vierge. et on renvoi une map selon les criteres définit par l'utilisateur et avec un template vierge
ipcMain.on('new-map',(event, mapData) => {
  mapData.template = generateVirginMap(mapData);
  currentMap = mapData  ;
  currentMap.generationNbr = 0;
  event.sender.send('generate-map', currentMap);
})

// on ecoute le lancement ou la relance de l'evolution du jeu et on renvoi le nouvel etat du template
ipcMain.on('generate-next',(event, currentMap) => {  
  currentMap.template = evolveTemplate(currentMap);
  currentMap.generationNbr ++;
  event.sender.send('generate-map',currentMap);
})

//on ecoute la map prédefinie choisie et on la renvoie avec son template.
ipcMain.on('map-generation',(event, mapName) => {
  if(mapName === 'random') {
    currentMap = generateRandomMap()
  }
  else {
    currentMap = generateGameFromMap(mapName);
  }
  event.sender.send('generate-map', currentMap);
})

ipcMain.on('reset-map',(event, startMap) => {
  currentMap = startMap
  currentMap.generationNbr = 0
  event.sender.send('generate-map', currentMap)
})

ipcMain.on('refresh-browser',(event) => {
  mainWindow.reload()
})

ipcMain.on('save-current-map', (event, mapToSave) => {
  var mapName = maps.find(x => x.name == mapToSave.name);
 

  if(mapName === undefined){
    var mapTemplate = maps.find(y => y.template === mapToSave.template)
    if(mapTemplate === undefined) {
      saveNewMap(mapToSave);
    }
    else {
      event.sender.send('error-template-existing');
    }
  }
  else {
    event.sender.send('error-name-existing');
  }
})
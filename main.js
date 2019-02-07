const electron = require('electron');
const { ipcMain } = require('electron');
const app = electron.app;
const maps= require('./maps/maps');
const fs = require('fs');
const GameOfLife = require('./lib/GameOfLife')


const BrowserWindow = electron.BrowserWindow;
let mainWindow;
let currentMap = {};

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

//on genere une nouvelle partie a partir d'une map existante
let setMapByName = (mapName) => {

  var map = maps.findIndex(x => x.name === mapName)
  return maps[map]
}

//on enregistre la map creer dans le fichier map.json
let saveNewMap = (map) => {
  maps.push(map)
  fs.writeFile('./maps/maps.json', JSON.stringify(maps), () => {

    mainWindow.webContents.send('map-saved');
  })
};

//ipcMain Listenner

// on ecoute  la création d'une nouvelle map vierge. et on renvoi une map selon les criteres définit par l'utilisateur et avec un template vierge
ipcMain.on('new-map',(event, mapData) => {
  mapData.template = GameOfLife.generateEmptyTemplate(mapData.width, mapData.height);
  currentMap = mapData  ;
  currentMap.generationNbr = 0;
  event.sender.send('generate-map', currentMap);
});

// on ecoute le lancement ou la relance de l'evolution du jeu et on renvoi le nouvel etat du template
ipcMain.on('generate-next',(event, currentMap) => {  
  currentMap.template = GameOfLife.evolveTemplate(currentMap.template);
  currentMap.generationNbr ++;
  event.sender.send('generate-map',currentMap);
});

//on ecoute la map prédefinie choisie et on la renvoie avec son template.
ipcMain.on('map-generation',(event, mapName) => {
  if(mapName === 'random') {
    currentMap = GameOfLife.generateRandomMapOfMaxSize()
  }
  else {
    currentMap = setMapByName(mapName);
  }
  event.sender.send('generate-map', currentMap);
});

ipcMain.on('random-map-generation',(event,mapData) => {
  mapData.template = GameOfLife.generateRandomTemplate(mapData.width, mapData.height)
  currentMap = mapData  ;
  currentMap.generationNbr = 0;
  event.sender.send('generate-map', currentMap);
})

//on recupere la map de depart et on la renvoi pour la mettre en place
ipcMain.on('reset-map',(event, startMap) => {
  currentMap = startMap
  currentMap.generationNbr = 0
  event.sender.send('generate-map', currentMap)
});

//on refresh la fenetre pour revenir au debut
ipcMain.on('refresh-browser',() => {
  currentMap = {};
  mainWindow.reload();
});

//on recupere la map a sauvegarder et on verifie le nom n'est pas deja pris. Si c'est le cas on renvoi un message d'erreur
ipcMain.on('save-current-map', (event, mapToSave) => {
  var mapName = maps.find(x => x.name == mapToSave.name);
 

  if(mapName === undefined){
      saveNewMap(mapToSave);
  }
  else {
    event.sender.send('error-name-existing');
  }
});
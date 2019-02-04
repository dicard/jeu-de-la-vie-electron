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

//methods
exports.generateRandomStart = (gridData) => {
  var randomArray= new Array(gridData.height);

    for(var i = 0; i < gridData.height; i++) {
      randomArray[i]= [];
      for(var j = 0; j < gridData.width; j++) {
        randomArray[i][j] = Math.floor(Math.random() * 2);
      }
    }

    return randomArray;
    
}


//ipc Things

ipcMain.on('new-game',(event, gridData) => {
  var randomArray = this.generateRandomStart(gridData);
  event.sender.send('randomArray', randomArray);
})

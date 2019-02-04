const $ = require('jquery');
const { ipcRenderer } = require('electron');

var generationInterval;
var newGame = (event) => {
  event.preventDefault();
  var width = ($('#grid-width').val() > 80) ? 80 : $('#grid-width').val();

  var height= ($('#grid-height').val()) > 40 ? 40 : $('#grid-height').val();
  
  this.gridData= {
    cssWidth: (width*20) + (width*0.4),
    width: width,
    height: height,
  };
  ipcRenderer.send('new-game', this.gridData)
};

var startGame = () => {
  generationInterval = setInterval(generateNext,200);
}

var pauseGame = () => {
  clearInterval(generationInterval);
}
var generateNext = () => {
  ipcRenderer.send('generate-next');
}
ipcRenderer.on('generate-grid', (event, randomArray,generationNbr) => {  
  var className = '';
  var grid = $('#grid');

  grid.empty();
  grid.css('width', this.gridData.cssWidth);
  
  
  for(var i = 0; i < this.gridData.height; i++){
    for(var j = 0; j < this.gridData.width; j++) {
      
      if(randomArray[i][j] === 1){
        className = 'cell alive-cell';
      }
      else {
        className ='cell dead-cell';
      }
      grid.append($(document.createElement('div')).addClass(className));
    }
  }
  $('#generation-number').text(generationNbr);
})
  
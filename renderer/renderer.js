const $ = require('jquery');
const { ipcRenderer } = require('electron');

// var app = {
//   gridData: {
//     width:80,
//     height: 40,
//     configuration:"1"
//   },

//   init: () => {
  
//     $('#configuration').on('click',ipcRenderer.send('new-game', $()));
//   },

//   setGridData: () => {
//     console.log($('#grid-width').val());
    

//   },

//   generateGrid: () => {
//     app.grid = $('#grid');
  
//     for(var i = 0; i < app.gridData.height; i++){      
//       for(var j = 0; j < app.gridData.width; j++){
//         app.grid.append('<div class="cell dead-cell"></div>')
//       }
//     }
//   }
  

// };

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
  ipcRenderer.send('start-game');
}

ipcRenderer.on('generate-grid', (event, randomArray) => {  
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

})
  
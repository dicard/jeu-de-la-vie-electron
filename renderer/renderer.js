const $ = require('jquery');
const { ipcRenderer } = require('electron');

var generationInterval;
var currentMap = {};
var startMap = {}

var virginNewMap = (event) => {
  event.preventDefault();
  $('#virgin-map-creation').hide();
  $('.game-info').show();
  $('#save-map').show();
  $('#defined-map-creation').hide()
  $('#virgin-map').hide();
  
  currentMap.name = $('#map-name').val();
  currentMap.width = ($('#map-width').val() > 80 || $('#map-width').val() == '')  ? 80 : $('#map-width').val();
  currentMap.height = ($('#map-height').val()> 40 || $('#map-height').val() == '') ? 40 : $('#map-height').val();

  ipcRenderer.send('new-map', currentMap)
}

var startGame = () => {
  clearInterval(generationInterval)
  
  if(currentMap.generationNbr === 0) {
    startMap = currentMap;
  }

  setMapTemplate();
  
  generationInterval = setInterval(generateNext,1000);
  
};

var pauseGame = () => {
  clearInterval(generationInterval);
  
};

var generateNext = () => { 
  ipcRenderer.send('generate-next', currentMap);
};

var definedNewMap = (mapName) => {
  $('#virgin-map-creation').hide();
  $('.game-info').show();
  ipcRenderer.send('map-generation', mapName);
};

var changeCellState = (data) => {
  var alive = $(data).hasClass('alive-cell');
  if(alive === true) {
    $(data).removeClass('alive-cell');
  }
  else {
    $(data).addClass('alive-cell');
  } 
}

var resetMap = () => {
  if(currentMap.generationNbr === 0) {
    window.alert("Vous etes deja sur la mise en place de départ !")
  }
  else {
    ipcRenderer.send('reset-map', startMap)

  }
}

var returnToSpawn = () => {
  ipcRenderer.send('refresh-browser')
}

var setMapTemplate = () => {
  $('.row').each((i, element)=> {
    $(element).children('.cell').each((j,childElement) => {
      var alive = $(childElement).hasClass('alive-cell');
      
      if(alive === true) {
        currentMap.template[i][j] = 1;
      }
    })    
  });
}

var saveMap = (event) => {
  event.preventDefault();
  setMapTemplate();
  
  
  ipcRenderer.send('save-current-map', currentMap);
  
}

ipcRenderer.on('generate-map', (event, gameMap) => {  
  currentMap = gameMap; 
  
  var className= '' ;
  var frontMap = $('#map');

  $('#generation-number').text(currentMap.generationNbr);
  $('#current-map-name').text(currentMap.name)
  $('#current-map-size').text(currentMap.width + 'x' + currentMap.height)

  frontMap.empty();  
  frontMap.css('width', currentMap.width * 20.4);
  
  
  for(var i = 0; i < currentMap.height; i++){
    var row = $(document.createElement('div'));
    frontMap.append(row);
    row.addClass('row')
    for(var j = 0; j < currentMap.width; j++) {
            
      if(currentMap.template[i][j] === 1){
        className = 'cell alive-cell';
      }
      else {
        className ='cell';
      }
        row.append($(document.createElement('div')).addClass(className).attr('onclick', 'changeCellState(this)'));
    }
  }


  
});


ipcRenderer.on('maps-options', (event,maps) => {
  var optionList = document.getElementById("map-select").options
  maps.forEach(map => {    
    optionList.add(
      new Option(map.name, map.name)
    )
  });
});

ipcRenderer.on('error-name-existing',() => {
  window.alert('Attention une Map avec ce nom est déja enregistée, veuillez en choisir un autre.');
});

ipcRenderer.on('error-template-existing',() => {
  window.alert('Attention ce template est déja utilisé dans une map existante, veuillez le modifier.');
})

ipcRenderer.on('map-saved', () => {
  window.alert('Votre map a bien été sauvegardé.');
})

const $ = require('jquery');
const { ipcRenderer } = require('electron');

var generationInterval;
var currentMap = {};
var startMap = {}


//on cache les elements dont one ne veux plus, on affiche les nouveau elements que l'on souhaite, on paramettre le nom la width et la heght d'une nouvelle map puis on demande au main de generer un nouveau template vierge
// eslint-disable-next-line
var virginNewMap = (event) => {
  event.preventDefault();
  $('#welcome-message').hide()
  $('#virgin-map-creation').hide();
  $('.game-info').show();
  $('#save-map').show();
  $('#defined-map-creation').hide()
  $('#virgin-map').hide();
  $('#random-map').hide();
  
  currentMap.name = $('#map-name').val();
  currentMap.width = ($('#map-width').val() > 80 || $('#map-width').val() == '')  ? 80 : $('#map-width').val();
  currentMap.height = ($('#map-height').val()> 40 || $('#map-height').val() == '') ? 40 : $('#map-height').val();

  ipcRenderer.send('new-map', currentMap)
};



//eslint-disable-next-line
var randomNewMap = (event) => {
  event.preventDefault();
  $('#welcome-message').hide()
  $('#virgin-map-creation').hide();
  $('.game-info').show();
  $('#save-map').show();
  $('#defined-map-creation').hide()
  $('#virgin-map').hide();
  $('#random-map').hide();

  currentMap.name = 'Aléatoire';
  currentMap.width = ($('#map-width').val() > 80 || $('#map-width').val() == '')  ? 80 : $('#map-width').val();
  currentMap.height = ($('#map-height').val()> 40 || $('#map-height').val() == '') ? 40 : $('#map-height').val();

  ipcRenderer.send('random-map-generation', currentMap)
};


 //on lance ou reprend le jeu a partir de la map en cours et on set une interval pour lancer la prochaine generation toute les 0.5 secondes
 // eslint-disable-next-line
var startGame = () => {
  clearInterval(generationInterval)
  
  if(currentMap.generationNbr === 0) {
    startMap = currentMap;
  }

  setMapTemplate();
  
  generationInterval = setInterval(generateNext,500);
  
};


//on clear l'interval pour aretter la generation
// eslint-disable-next-line
var pauseGame = () => {
  clearInterval(generationInterval);
  
};


//on demande au main de generer le prochain etat du template par rapport a la map actuelle
var generateNext = () => { 
  ipcRenderer.send('generate-next', currentMap);
};


//on cache les info dont on ne veux plus et affiche celles que l'on souhaite et on demande au main de generer une map par rapport au nom de la map choisie
// eslint-disable-next-line
var definedNewMap = (mapName) => {
  $('#virgin-map-creation').hide();
  $('#welcome-message').hide()
  $('.game-info').show();
  ipcRenderer.send('map-generation', mapName);
};


//on change l'etat d'une cellule quand on clique dessus
// eslint-disable-next-line
var changeCellState = (data) => {
  var alive = $(data).hasClass('alive-cell');
  if(alive === true) {
    $(data).removeClass('alive-cell');
  }
  else {
    $(data).addClass('alive-cell');
  } 
}


//on demande au main de generer a nouveau la map de depart
// eslint-disable-next-line
var resetMap = () => {
  if(currentMap.generationNbr === 0) {
    window.alert("Vous etes deja sur la mise en place de départ !")
  }
  else {
    ipcRenderer.send('reset-map', startMap)

  }
}


//on demande au main de revenir au debut
// eslint-disable-next-line
var returnToSpawn = () => {
  ipcRenderer.send('refresh-browser')
}


//on definis le template par rapport aux cellules en vie ou non
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


//on demande au main de sauvegarder la map actuelle dans le fichier JSON
// eslint-disable-next-line
var saveMap = (event) => {
  event.preventDefault();
  setMapTemplate();
  ipcRenderer.send('save-current-map', currentMap);
}




//ipcRenderer Listenner

//on genere la map en fonction des données recues
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



//on recupere les map a mettre en option du select
ipcRenderer.on('maps-options', (event,maps) => {
  var optionList = document.getElementById("map-select").options
  maps.forEach(map => {    
    optionList.add(
      new Option(map.name, map.name)
    )
  });
});


//on affiche un message d'erreur si une map porte deja le meme nom que celle qu'on veut enregistrer
ipcRenderer.on('error-name-existing',() => {
  window.alert('Attention une Map avec ce nom est déja enregistée, veuillez en choisir un autre.');
});


//on affiche un message lors de la bonne sauvegarde de la map dans le fichier json
ipcRenderer.on('map-saved', () => {
  window.alert('Votre map a bien été sauvegardé.');
})

import TrackManager from './js/TrackManager.js';

//Handling Input of Tracks
function handleFileSelect(evt){
    var file = evt.target.files[0]; // FileList object

    evt.stopPropagation();
    evt.preventDefault();

    console.log('file ' + file.name + ' vom typ ' + file.type + ' wurde geladen');
    if (file.type.substring(0, 5) == 'audio') {
        loadAudioFile(file);
    } else if (file.type.substring(0, 5) == 'video') {
        loadVideoFile(file);
    }
}
function loadAudioFile(file) {
    let trackNumber = TrackManager.findFirstEmptyTrack();
    TrackManager.addAudioTrack(trackNumber, file.name);
    TrackManager.getTrack(trackNumber).loadFileIntoBuffer(file);
    addComponentToUI(TrackManager.getTrack(trackNumber));
}

function loadAudioStream(streamNode) {
    if (streamNode == undefined) {
        console.log("Stream is undefined!");
    } else if (streamNode == null) {
        console.log("Stream is null!");
    } else {
        console.log('it\'s a stream!');
        let trackNumber = TrackManager.findFirstEmptyTrack();
        TrackManager.addAudioTrack(trackNumber, null);
        TrackManager.getTrack(trackNumber).importAudioStream(streamNode);
        addComponentToUI(TrackManager.getTrack(trackNumber));
    }
}

function addComponentToUI(component) {
    /*let row = Math.floor(component.id / 2) + 1;
    let column = (component.id % 2) + 1;
    component.style.gridRow = row;
    component.style.gridColumn = column;*/

    document.getElementsByClassName('firstEQ').item(0).appendChild(component)
}

// Hier startet die App
document.addEventListener('DOMContentLoaded', () => {

    //Get all Input-Selectors from index.html
    let fileLoad1 = document.getElementById('myFile1');
    let fileLoad2 = document.getElementById('myFile2');
    let fileLoad3 = document.getElementById('myFile3');
    let fileLoad4 = document.getElementById('myFile4');
    fileLoad1.addEventListener('change', handleFileSelect, false);
    fileLoad2.addEventListener('change', handleFileSelect, false);
    fileLoad3.addEventListener('change', handleFileSelect, false);
    fileLoad4.addEventListener('change', handleFileSelect, false);

    }
)

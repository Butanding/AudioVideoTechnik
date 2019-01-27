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

    //Why 4? Because the first 3 Slots in Gridcontainer are for Video, MainEQ, etc..
    //This is actually super-stupid hardcoded and should be dynamic in future
    var firstSelectableEQSlot = 3;
    var trackID = parseInt(component.id);
    //At the moment player supports only 4 EQ's so have to limit
    if( trackID > 3)
        trackID = trackID-3;
    //Multiply beacause of Child-Selection;
    var currentSlot = trackID*2;
    var sum = firstSelectableEQSlot+currentSlot;

    let gridContainer = document.getElementsByClassName('grid-container').item(0);
    console.log('Adding Track to #EQ: ' + sum);
    let currentEqualizer = gridContainer.childNodes.item(firstSelectableEQSlot+currentSlot).nextSibling.nextSibling;
    //If there is already track in this EQ, remove the old one first
    if(currentEqualizer.childNodes.length > 3)
        currentEqualizer.childNodes.item(4).remove();

    console.log(currentEqualizer);

    currentEqualizer.appendChild(component);
}

// Hier startet die App
document.addEventListener('DOMContentLoaded', () => {

    //Get all Input-Selectors from index.html
    let audioTrackBtn = document.getElementById('newAudioTrack');
    audioTrackBtn.addEventListener('change', handleFileSelect, false);

    }
)

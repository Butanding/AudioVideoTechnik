import TrackManager from './js/TrackManager.js';

//Handling Input of Tracks
function handleFileSelect(evt){
    var file = evt.target.files[0]; // FileList object

    evt.stopPropagation();
    evt.preventDefault();

    if (file.type.substring(0, 5) == 'audio') {
        if(emptyAudioSlotCheck()){
            console.log('file ' + file.name + ' vom typ ' + file.type + ' wird geladen');
            loadAudioFile(file);
        }
    } else if (file.type.substring(0, 5) == 'video') {
        loadVideoFile(file);
    }
}

function emptyAudioSlotCheck(){
    if(TrackManager.findFirstEmptyTrack()<0){
        console.info("No free Slot available");
        return false;
    }else{
        console.info("Found free Slot available");
        return true;
    }
}


function loadAudioFile(file) {
    let trackNumber = TrackManager.findFirstEmptyTrack();
    TrackManager.addAudioTrack(trackNumber, file.name);
    TrackManager.getTrack(trackNumber).loadFileIntoBuffer(file);
    addComponentToUI(TrackManager.getTrack(trackNumber));
    emptyAudioSlotCheck();
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

    var equalizers = document.getElementsByClassName("equalizer");
    var trackID = parseInt(component.id);
    console.log('Adding Track to #EQ: ' + trackID);
    var currentEqualizer = equalizers.item(trackID);
    currentEqualizer.appendChild(component);
}

// Hier startet die App
document.addEventListener('DOMContentLoaded', () => {

    //Get all Input-Selectors from index.html
    let audioTrackBtn = document.getElementById('uploadAudioTrack');
    audioTrackBtn.addEventListener('change', handleFileSelect, false);

    }
)

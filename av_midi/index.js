import TrackManager from './js/TrackManager.js';

//Handling Input of Tracks
function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object

    evt.stopPropagation();
    evt.preventDefault();

    console.log(file.type);
    if (file.type.substring(0, 5) == 'audio') {
        if (emptyAudioSlotCheck()) {
            console.log('file ' + file.name + ' vom typ ' + file.type + ' wird geladen');
            loadAudioFile(file);
        }
    } else if (file.name.slice(-4) == '.mpd') {
        console.log("VIDEO");
        if (emptyVideoSlotCheck()) {
            console.log('file ' + file.name + ' vom typ ' + file.name.slice(-4) + ' wird geladen');
            loadVideoFile(file);
        }
    }
}

function emptyAudioSlotCheck() {
    if (TrackManager.findFirstEmptyAudioTrack() < 0) {
        console.info("No free Slot available");
        return false;
    } else {
        return true;
    }
}

function emptyVideoSlotCheck() {
    if (TrackManager.findFirstEmptyVideoTrack() < 0) {
        console.info("No free Slot available");
        return false;
    } else {
        return true;
    }
}

function loadAudioFile(file) {
    let trackNumber = TrackManager.findFirstEmptyAudioTrack();
    TrackManager.addAudioTrack(trackNumber, file.name);
    TrackManager.getAudioTrack(trackNumber).loadFileIntoBuffer(file);
    addComponentToUI(TrackManager.getAudioTrack(trackNumber));
    emptyAudioSlotCheck();
}

function loadAudioStream(streamNode) {
    if (streamNode == undefined) {
        console.log("Stream is undefined!");
    } else if (streamNode == null) {
        console.log("Stream is null!");
    } else {
        console.log('it\'s a stream!');
        let trackNumber = TrackManager.findFirstEmptyAudioTrack();
        TrackManager.addAudioTrack(trackNumber, null);
        TrackManager.getTrack(trackNumber).importAudioStream(streamNode);
        addVideoComponentToUI(TrackManager.getTrack(trackNumber));
    }
}

function loadVideoFile(file) {
    let trackNumber = TrackManager.findFirstEmptyVideoTrack();
    TrackManager.addVideoTrack(trackNumber, file.name);/*
    TrackManager.getVideoTrack(trackNumber).loadFileIntoBuffer(file);*/
    addVideoComponentToUI(TrackManager.getVideoTrack(trackNumber));
}

function addComponentToUI(component) {

    var equalizers = document.getElementsByClassName("equalizer");
    var trackID = parseInt(component.id);
    console.log('Adding Track to #EQ: ' + trackID);
    var currentEqualizer = equalizers.item(trackID);
    currentEqualizer.appendChild(component);
}

function addVideoComponentToUI(component) {

    var equalizers = document.getElementsByClassName("video-equalizer");
    var trackID = parseInt(component.id);
    console.log('Adding Track to #VideoEQ: ' + trackID);
    var currentEqualizer = equalizers.item(trackID);
    console.log(currentEqualizer);
    currentEqualizer.appendChild(component);
}

// Hier startet die App
document.addEventListener('DOMContentLoaded', () => {

        //Get all Input-Selectors from index.html
        let audioUploadButton = document.getElementById('uploadAudioTrack');
        audioUploadButton.addEventListener('change', handleFileSelect, false);

        let videoUploadButton = document.getElementById('uploadVideoTrack');
        videoUploadButton.addEventListener('change', handleFileSelect, false);

    }
);

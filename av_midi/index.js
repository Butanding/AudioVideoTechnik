import TrackManager from './js/TrackManager.js';

let randomVideoURL = [
    "http://dash.edgesuite.net/akamai/bbb_30fps/bbb_30fps.mpd",
    "https://dash.akamaized.net/envivio/EnvivioDash3/manifest.mpd",
    "http://yt-dash-mse-test.commondatastorage.googleapis.com/media/car-20120827-manifest.mpd",
    "https://bitmovin-a.akamaihd.net/content/playhouse-vr/mpds/105560.mpd",
    "http://www.bok.net/dash/tears_of_steel/cleartext/stream.mpd"
];

//Handling Input of Tracks
function handleFileSelect(evt) {
    var file = evt.target.files[0]; // FileList object only select the first File, others will be ignored

    evt.stopPropagation();
    evt.preventDefault();

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

function loadRandomAudioSamples(evt){
    console.log("Loading random audio Samples");
    let soundSamplesFolder = './res/soundfiles/';

    let soundSamples = [
        "./res/soundfiles/audience.mp3",
        "./res/soundfiles/basic_beat.wav",
        "./res/soundfiles/basic_loop.wav",
        "./res/soundfiles/classic_music.wav",
    ]

    for (let i = 0; i < soundSamples.length; i++) {
        if (emptyAudioSlotCheck()) {
            let trackNumber = TrackManager.findFirstEmptyAudioTrack();
            TrackManager.addAudioTrack(trackNumber, soundSamples[i]);
            TrackManager.getAudioTrack(trackNumber).loadUrlIntoBuffer(soundSamples[i]);
            addComponentToUI(TrackManager.getAudioTrack(trackNumber));
        }
    }
}



function handleVideoURL(evt) {
    console.log();
    if (emptyVideoSlotCheck()) {
        let trackNumber = TrackManager.findFirstEmptyVideoTrack();
        //If manual URL, load Value from Input field
        let url = document.getElementById("loadVideoURL").value;
        //If random Button was pressed, select random Video
        if(evt.srcElement.getAttribute("id") == "random"){
            console.log("Random Video wird geladen");
            //Select random video Track from URL list and load Video
            url = randomVideoURL[Math.floor(Math.random() * randomVideoURL.length+1)];
        }
        TrackManager.addVideoTrack(trackNumber, url);
        addVideoComponentToUI(TrackManager.getVideoTrack(trackNumber));
    }

}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var file = evt.dataTransfer.files[0];
    if (file != null) {
        if (file.type.substring(0, 5) == 'audio') {
            if (emptyAudioSlotCheck()) {
                console.log('file ' + file.name + ' vom typ ' + file.type + ' wird geladen');
                loadAudioFile(file);
            }
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
    let localVideoPath = "../../res/video/";
    TrackManager.addVideoTrack(trackNumber, localVideoPath + file.name);/*
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

function pauseAll(){
    for (let i=0; i<4; i++){
        if(TrackManager.getAudioTrack(i) != null){
            if(TrackManager.getAudioTrack(i).isPlaying){
                TrackManager.getAudioTrack(i).pausePlayback();
            }
        }
    }
}

function playAll(){
    for (let i=0; i<4; i++){
        if(TrackManager.getAudioTrack(i) != null){
            if(!TrackManager.getAudioTrack(i).isPlaying){
                TrackManager.getAudioTrack(i).startPlayback();
            }
        }
    }
}

function muteAll(){
    for (let i=0; i<4; i++){
        if(TrackManager.getAudioTrack(i) != null){
            TrackManager.getAudioTrack(i).changeVolume(0);
        }
    }
}

function unmuteAll(){
    for (let i=0; i<4; i++){
        if(TrackManager.getAudioTrack(i) != null){
            TrackManager.getAudioTrack(i).changeVolume(60);
        }
    }
}


function resetAll(){
    for (let i=0; i<4; i++){
        if(TrackManager.getAudioTrack(i) != null){
            TrackManager.getAudioTrack(i).stopPlayback();
            TrackManager.getAudioTrack(i).shadowRoot.innerHTML = null;
            TrackManager.deleteAudioTrack(i);
        }
    }
}


function loadRandomVideoSamples() {

}

function pauseAllVideos() {

}

function playAllVideos() {

}

function muteAllVideos() {

}

function resetAllVideos() {

}

// Hier startet die App
document.addEventListener('DOMContentLoaded', () => {

        // dropzone
        let dropZone = document.getElementsByClassName('management');
        console.log(dropZone[0]);
        //Audio-Dropzone
        dropZone[0].addEventListener('dragover', handleDragOver, false);
        dropZone[0].addEventListener('drop', handleDrop, false);

        //Get all Input-Selectors from index.html
        let audioUploadButton = document.getElementById('uploadAudioTrack');
        audioUploadButton.addEventListener('change', handleFileSelect, false);

        let videoUploadButton = document.getElementById('uploadVideoTrack');
        videoUploadButton.addEventListener('change', handleFileSelect, false);

        let videoRandomButton = document.getElementById('loadVideoRandom');
        videoRandomButton.addEventListener('click', handleVideoURL, false);

        let videoURLButton = document.getElementById('submitLoadVideoURL');
        videoURLButton.addEventListener('click', handleVideoURL, false);

        /**
         * General Audio-Controller
         * @type {HTMLElement}
         */
        let loadRandomAudio = document.getElementById('loadRandomAudio');
        loadRandomAudio.addEventListener('click', loadRandomAudioSamples, false);

        let pauseAllChannels = document.getElementById('pauseAllChannels');
        pauseAllChannels.addEventListener('click', pauseAll, false);

        let playAllChannels = document.getElementById('playAllChannels');
        playAllChannels.addEventListener('click', playAll, false);

        let muteAllChannels = document.getElementById('muteAllChannels');
        muteAllChannels.addEventListener('click', muteAll, false);

        let unmuteAllChannels = document.getElementById('unmuteAllChannels');
        unmuteAllChannels.addEventListener('click', unmuteAll, false);

        let resetAllChannels = document.getElementById('resetAllChannels');
        resetAllChannels.addEventListener('click', resetAll, false);

    /**
     * General Video-Controller
     */
    let loadRandomVideo = document.getElementById('loadRandomVideo');
    loadRandomVideo.addEventListener('click', loadRandomVideoSamples, false);

    let pauseAllVideoChannels = document.getElementById('pauseAllVideoChannels');
    pauseAllVideoChannels.addEventListener('click', pauseAllVideos, false);

    let playAllVideoChannels = document.getElementById('playAllVideoChannels');
    playAllVideoChannels.addEventListener('click', playAllVideos, false);

    let muteAllVideoChannels = document.getElementById('muteAllVideoChannels');
    muteAllVideoChannels.addEventListener('click', muteAllVideos, false);

    let unmuteAllVideoChannels = document.getElementById('unmuteAllVideoChannels');
    unmuteAllVideoChannels.addEventListener('click', unmuteAll, false);

    let resetAllVideoChannels = document.getElementById('resetAllVideoChannels');
    resetAllVideoChannels.addEventListener('click', resetAllVideos, false);
    }
);

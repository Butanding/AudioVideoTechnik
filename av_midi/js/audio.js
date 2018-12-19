"use strict";
import Visuaziler from "./videoplayer.js";

// create Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let source;
let stream;

//load video content
document.addEventListener('DOMContentLoaded', () => {
  let videoplayer = new Visuaziler();
  document.getElementById("visualizer").appendChild(videoplayer);
});

// get the audio element
const audioElement = document.querySelector('audio');

// pass it into the audio context
const track = audioCtx.createMediaElementSource(audioElement);

track.connect(audioCtx.destination);

// select our play button
const playButton = document.getElementById('audioPlayback');

playButton.addEventListener('click', function() {
  // check if context is in suspended state (autoplay policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === 'false') {
    audioElement.play();
    this.dataset.playing = 'true';
  } else if (this.dataset.playing === 'true') {
    audioElement.pause();
    this.dataset.playing = 'false';
  }

}, false);


audioElement.addEventListener('ended', () => {
  playButton.dataset.playing = 'false';
}, false);

const gainNode = audioCtx.createGain();

track.connect(gainNode).connect(audioCtx.destination);

const volumeControl = document.querySelector('#volume');

volumeControl.addEventListener('input', function() {
  gainNode.gain.value = this.value;
}, false);


// record microphone + drawVisual

//set up the different audio nodes we will use for the app

var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

var distortion = audioCtx.createWaveShaper();
var biquadFilter = audioCtx.createBiquadFilter();
var convolver = audioCtx.createConvolver();



var visualSelect = document.getElementById("visual");

var drawVisual;



function useMicrophone() {
  if (navigator.getUserMedia) {
    console.log('getUserMedia supported.');
    navigator.getUserMedia(
      // constraints - only audio needed for this app
      {
        audio: true
      },

      // Success callback
      function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.connect(distortion);
        distortion.connect(biquadFilter);
        biquadFilter.connect(convolver);
        convolver.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        visualize();

      },

      // Error callback
      function(err) {
        console.log('The following gUM error occured: ' + err);
      }
    );
  } else {
    console.log('getUserMedia not supported on your browser!');
  }
}

function visualize() {
  console.log("starting visualization");


}

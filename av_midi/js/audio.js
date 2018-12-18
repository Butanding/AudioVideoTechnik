"use strict";

// create Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
let source;
let stream;

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

var canvas = document.querySelector('.visual');
var canvasCtx = canvas.getContext("2d");


var visualSelect = document.getElementById("visual");

var drawVisual;

visualize();

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

  analyser.fftSize = 256;
  var bufferLength = analyser.frequencyBinCount;
  console.log(bufferLength);
  var dataArray = new Float32Array(bufferLength);

  canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

  function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getFloatFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    var barWidth = (canvas.width / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] + 140) * 2;

      canvasCtx.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ',50,50)';
      canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }

  draw();

}

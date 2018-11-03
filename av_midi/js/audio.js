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
const playButton = document.querySelector('button');

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

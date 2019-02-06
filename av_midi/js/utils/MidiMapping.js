import TrackManager from '../TrackManager.js';
import AudioTrack from '../track/AudioTrack.js'
import VideoTrack from '../track/VideoTrack.js'
import Controller from '../utils/Controller.js';


// This array stores all the mappings
let button = new Array();

// This is the channel of the midicontroller
let channelNumber = 4;

/****************************************************
 * GENERAL BUTTONS/SLIDER (for both audio and video)
 ****************************************************/

// resets all audio and video samples
button.push({
    channel: channelNumber,
    btnID: 18,
    cmd: 9,
    fn: function () {
      Controller.resetAll();
      Controller.resetAllVideos();
    }
});

// plays all audio samples
button.push({
    channel: channelNumber,
    btnID: 19,
    cmd: 9,
    fn: function () {
      Controller.playAll();
    }
});

// pauses all audio samples
button.push({
    channel: channelNumber,
    btnID: 20,
    cmd: 9,
    fn: function () {
        Controller.pauseAll();
    }
});

// mutes all audiosamples
button.push({
    channel: channelNumber,
    btnID: 23,
    cmd: 9,
    fn: function () {
        Controller.muteAll();
    }
});

// unmutes all audiosamples
button.push({
    channel: channelNumber,
    btnID: 24,
    cmd: 9,
    fn: function () {
      Controller.unmuteAll();
    }
});

// plays all video samples
button.push({
    channel: channelNumber,
    btnID: 27,
    cmd: 9,
    fn: function () {
      Controller.playAllVideos();
  }
});

// stops all video samples
button.push({
    channel: channelNumber,
    btnID: 28,
    cmd: 9,
    fn: function () {
Controller.pauseAllVideos();
    }
});

// mutes all videosamples
button.push({
    channel: channelNumber,
    btnID: 31,
    cmd: 9,
    fn: function () {
Controller.muteAllVideos();
    }
});

// unmutes all videosamples
button.push({
    channel: channelNumber,
    btnID: 32,
    cmd: 9,
    fn: function () {
      Controller.unmuteAllVideos();
    }
});

// change volume audio channel 1
button.push({
    channel: channelNumber,
    btnID: 48,
    cmd: 11,
    fn: function (value) {
      Controller.changeVolumeChannelOne(value);
    }
});

// change volume audio channel 2
button.push({
    channel: channelNumber,
    btnID: 49,
    cmd: 11,
    fn: function (value) {
      Controller.changeVolumeChannelTwo(value);
    }
});


// change volume audio channel 3
button.push({
    channel: channelNumber,
    btnID: 50,
    cmd: 11,
    fn: function (value) {
      Controller.changeVolumeChannelThree(value);
    }
});



// change volume audio channel 4
button.push({
    channel: channelNumber,
    btnID: 51,
    cmd: 11,
    fn: function (value) {
      Controller.changeVolumeChannelFour(value);
    }
});


// change speed of audio channel 1
button.push({
    channel: channelNumber,
    btnID: 1,
    cmd: 11,
    fn: function (value) {
      Controller.changeSpeedChannelOne(value);
    }
});

// change speed of audio channel 2
button.push({
    channel: channelNumber,
    btnID: 2,
    cmd: 11,
    fn: function (value) {
      Controller.changeSpeedChannelTwo(value);
    }
});

// change speed of audio channel 3
button.push({
    channel: channelNumber,
    btnID: 4,
    cmd: 11,
    fn: function (value) {
      Controller.changeSpeedChannelThree(value);
    }
});

// change speed of audio channel 4
button.push({
    channel: channelNumber,
    btnID: 5,
    cmd: 11,
    fn: function (value) {
      Controller.changeSpeedChannelFour(value);
    }
});

// loop all audio tracks
button.push({
    channel: channelNumber,
    btnID: 16,
    cmd: 9,
    fn: function () {
        Controller.loopAll();
    }
});

// unloop all audio tracks
button.push({
    channel: channelNumber,
    btnID: 17,
    cmd: 9,
    fn: function () {
        Controller.unloopAll();
    }
});


// start/stops channel 1
button.push({
    channel: channelNumber,
    btnID: 48,
    cmd: 9,
    fn: function () {
        Controller.toggleChannelOne();
    }
});

// start/stops channel 2
button.push({
    channel: channelNumber,
    btnID: 49,
    cmd: 9,
    fn: function () {
        Controller.toggleChannelTwo();
    }
});

// start/stops channel 3
button.push({
    channel: channelNumber,
    btnID: 50,
    cmd: 9,
    fn: function () {
        Controller.toggleChannelThree();
    }
});

// start/stops channel 4
button.push({
    channel: channelNumber,
    btnID: 51,
    cmd: 9,
    fn: function () {
        Controller.toggleChannelFour();
    }
});


// Crossfader
button.push({
    channel: channelNumber,
    btnID: 64,
    cmd: 11,
    fn: function (value) {
        Controller.crossFade(value);
    }
});

// change highshelf audio channel 1
button.push({
    channel: channelNumber,
    btnID: 14,
    cmd: 11,
    fn: function (value) {
      Controller.changeHighshelfChannelOne(value);
    }
});

// change highshelf audio channel 2
button.push({
    channel: channelNumber,
    btnID: 15,
    cmd: 11,
    fn: function (value) {
      Controller.changeHighshelfChannelTwo(value);
    }
});

// change highshelf audio channel 3
button.push({
    channel: channelNumber,
    btnID: 16,
    cmd: 11,
    fn: function (value) {
      Controller.changeHighshelfChannelThree(value);
    }
});

// change highshelf audio channel 4
button.push({
    channel: channelNumber,
    btnID: 17,
    cmd: 11,
    fn: function (value) {
      Controller.changeHighshelfChannelFour(value);
    }
});

// change lowshelf audio channel 1
button.push({
    channel: channelNumber,
    btnID: 18,
    cmd: 11,
    fn: function (value) {
      Controller.changeLowshelfChannelOne(value);
    }
});

// change lowshelf audio channel 2
button.push({
    channel: channelNumber,
    btnID: 19,
    cmd: 11,
    fn: function (value) {
      Controller.changeLowshelfChannelTwo(value);
    }
});


// change lowshelf audio channel 3
button.push({
    channel: channelNumber,
    btnID: 20,
    cmd: 11,
    fn: function (value) {
      Controller.changeLowshelfChannelThree(value);
    }
});


// change lowshelf audio channel 4
button.push({
    channel: channelNumber,
    btnID: 21,
    cmd: 11,
    fn: function (value) {
      Controller.changeLowshelfChannelFour(value);
    }
});


export default button;

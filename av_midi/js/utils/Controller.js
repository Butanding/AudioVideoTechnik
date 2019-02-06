import AudioTrack from '../track/AudioTrack.js';
import VideoTrack from '../track/VideoTrack.js';
import TrackManager from '../TrackManager.js';

class Controller {

  constructor() {}

  playAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        if (!TrackManager.getAudioTrack(i).isPlaying) {
          TrackManager.getAudioTrack(i).startPlayback();
        }
      }
    }
  }

  pauseAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        if (TrackManager.getAudioTrack(i).isPlaying) {
          TrackManager.getAudioTrack(i).pausePlayback();
        }
      }
    }
  }

  muteAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        TrackManager.getAudioTrack(i).changeVolume(0);
      }
    }
  }

  unmuteAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        TrackManager.getAudioTrack(i).changeVolume(60);
      }
    }
  }

  pauseAllVideos() {
    for (let i = 0; i < 2; i++) {
      if (TrackManager.getVideoTrack(i) != null) {
        TrackManager.getVideoTrack(i).player.pause();
      }
    }
  }

  playAllVideos() {
    for (let i = 0; i < 2; i++) {
      if (TrackManager.getVideoTrack(i) != null) {
        TrackManager.getVideoTrack(i).player.play();
      }
    }
  }

  muteAllVideos() {
    for (let i = 0; i < 2; i++) {
      if (TrackManager.getVideoTrack(i) != null) {
        TrackManager.getVideoTrack(i).player.setVolume(0);
      }
    }
  }

  unmuteAllVideos() {
    for (let i = 0; i < 2; i++) {
      if (TrackManager.getVideoTrack(i) != null) {
        TrackManager.getVideoTrack(i).player.setVolume(0.7);
      }
    }
  }

  loopAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        if (TrackManager.getAudioTrack(i).isPlaying) {
          TrackManager.getAudioTrack(i).isLooping = true;
          TrackManager.getAudioTrack(i).source.loop = true;
          TrackManager.getAudioTrack(i).shadowRoot.getElementById("loopAudioCheckbox").checked = true;

        }
      }
    }
  }

  unloopAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        if (TrackManager.getAudioTrack(i).isPlaying) {
          TrackManager.getAudioTrack(i).isLooping = false;
          TrackManager.getAudioTrack(i).source.loop = false;
          TrackManager.getAudioTrack(i).shadowRoot.getElementById("loopAudioCheckbox").checked = false;

        }
      }
    }
  }

  resetAll() {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        TrackManager.getAudioTrack(i).stopPlayback();
        TrackManager.getAudioTrack(i).shadowRoot.innerHTML = null;
        TrackManager.deleteAudioTrack(i);
      }
    }
  }

  resetAllVideos() {
    for (let i = 0; i < 2; i++) {
      if (TrackManager.getVideoTrack(i) != null) {
        //Stop possible Animation of Canvas-Filter
        cancelAnimationFrame(TrackManager.getVideoTrack(i).animationID);
        //Remove Canvas
        TrackManager.getVideoTrack(i).videoCanvas = null;
        //Remove Dashjs Player
        TrackManager.getVideoTrack(i).player.reset();
        //Empty Shadow-Root
        TrackManager.getVideoTrack(i).shadowRoot.innerHTML = null;
        //Delete Video from Global Trackmanager
        TrackManager.deleteVideoTrack(i);
      }
    }
  }

  changeVolumeChannelOne(value) {
    let i = 0;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeVolume(value);
    }
  }

  changeVolumeChannelTwo(value) {
    let i = 1;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeVolume(value);
    }
  }

  changeVolumeChannelThree(value) {
    let i = 2;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeVolume(value);
    }
  }

  changeVolumeChannelFour(value) {
    let i = 3;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeVolume(value);
    }
  }

  changeSpeedChannelOne(value) {
    let i = 0;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeSpeed(value);
    }
  }

  changeSpeedChannelTwo(value) {
    let i = 1;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeSpeed(value);
    }
  }

  changeSpeedChannelThree(value) {
    let i = 2;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeSpeed(value);
    }
  }

  changeSpeedChannelFour(value) {
    let i = 3;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeSpeed(value);
    }
  }

  toggleChannelOne() {
    let i = 0;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).togglePlayback();
    }
  }

  toggleChannelTwo() {
    let i = 1;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).togglePlayback();
    }
  }

  toggleChannelThree() {
    let i = 2;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).togglePlayback();
    }
  }

  toggleChannelFour() {
    let i = 3;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).togglePlayback();
    }
  }


  changeHighshelfChannelOne(value) {
    let i = 0;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeHighshelf(value);
    }
  }

  changeHighshelfChannelTwo(value) {
    let i = 1;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeHighshelf(value);
    }
  }

  changeHighshelfChannelThree(value) {
    let i = 2;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeHighshelf(value);
    }
  }

  changeHighshelfChannelFour(value) {
    let i = 3;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeHighshelf(value);
    }
  }

  changeLowshelfChannelOne(value) {
    let i = 0;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeLowshelf(value);
    }
  }

  changeLowshelfChannelTwo(value) {
    let i = 1;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeLowshelf(value);
    }
  }

  changeLowshelfChannelThree(value) {
    let i = 2;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeLowshelf(value);
    }
  }

  changeLowshelfChannelFour(value) {
    let i = 3;
    if (TrackManager.getAudioTrack(i) != null) {
      TrackManager.getAudioTrack(i).changeLowshelf(value);
    }
  }

  crossFade(value) {
    for (let i = 0; i < 4; i++) {
      if (TrackManager.getAudioTrack(i) != null) {
        console.log(value);
        console.log(127-value);
        TrackManager.getAudioTrack(0).changeVolume(127 - value);
        TrackManager.getAudioTrack(1).changeVolume(127 - value);
        TrackManager.getAudioTrack(2).changeVolume(value);
        TrackManager.getAudioTrack(3).changeVolume(value);
      }

    }
  }

}

export default new Controller;

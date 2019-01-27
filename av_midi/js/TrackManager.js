import AudioTrack from './track/AudioTrack.js';
import VideoTrack from './track/VideoTrack.js';

class TrackManager {
    constructor() {
        this.audioCtx = new AudioContext();
        this.audioTrack = new Array();
        //Currently supporting only 4 Tracks at a time
        this.audioTrack.length = 4;

        this.videoTrack = new Array();
        //Currently supporting only 4 Tracks at a time
        this.videoTrack.length = 2;


        this.activeAudioTrack = 0;
        this.activeVideoTrack = 0;
    }

    // Finds first empty AudioTrack
    findFirstEmptyAudioTrack() {
        for (let i = 0; i < this.audioTrack.length; i++) {
            if (this.audioTrack[i] == null)
                return i;
        }
        //If no Free Slot was found, return -1 to catch error
        return -1;
    }

    // Finds first empty VideoTrack
    findFirstEmptyVideoTrack() {
        for (let i = 0; i < this.videoTrack.length; i++) {
            if (this.videoTrack[i] == null)
                return i;
        }
        //If no Free Slot was found, return -1 to catch error
        return -1;
    }

    // Adds an AudioTrack to the tracklist
    addAudioTrack(number, name) {
        this.audioTrack[number] = new AudioTrack(this.audioCtx, number, name);
    }

    // Deletes a track
    //
    // number: number of the track to delete
    deleteAudioTrack(number) {
        this.audioTrack[number] = null;
    }

    // Adds a VideoTrack to the tracklist
    addVideoTrack(number, name) {
        this.videoTrack[number] = new VideoTrack(number, name);
    }

    // Returns a certain track
    //
    // number: number of the track to return
    getAudioTrack(number) {
        return this.audioTrack[number];
    }

    getVideoTrack(number) {
        return this.videoTrack[number];
    }

    getAudioCtx() {
        return this.audioCtx;
    }


}

export default new TrackManager;
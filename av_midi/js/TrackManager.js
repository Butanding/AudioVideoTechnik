import AudioTrack from './track/AudioTrack.js';

class TrackManager {
    constructor() {
        this.audioCtx = new AudioContext();
        this.track = new Array();
        //Currently supporting only 4 Tracks at a time
        this.track.length = 4;
        this.activeTrack = 0;
    }

    // Finds first empty track
    findFirstEmptyTrack() {
        for (let i = 0; i < this.track.length; i++) {
            if (this.track[i] == null)
                return i;
        }
        //If no Free Slot was found, return -1 to catch error
        return -1;
    }

    // Adds an AudioTrack to the tracklist
    addAudioTrack(number, name) {
        this.track[number] = new AudioTrack(this.audioCtx, number, name);
    }

    // Deletes a track
    //
    // number: number of the track to delete
    deleteTrack(number) {
        this.track[number] = null;
    }

    // Returns a certain track
    //
    // number: number of the track to return
    getTrack(number) {
        return this.track[number];
    }

    getAudioCtx() {
        return this.audioCtx;
    }


}

export default new TrackManager;
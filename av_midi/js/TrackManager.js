import AudioTrack from './track/AudioTrack.js';

class TrackManager {
    constructor() {
        this.audioCtx = new AudioContext();
        this.track = new Array();
        this.activeTrack = 0;
    }

    // Finds first empty track
    findFirstEmptyTrack() {
        for (let i = 0; i < this.track.length; i++) {
            if (this.track[i] == null)
                return i;
        }
        return this.track.length;
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


/**
 * Class to handle logic, behaviour and data of all audio elements as well as gui
 */
export default class AudioTrack extends HTMLElement {

    /**
     * Constructor.... it is.
     *
     * @param ctx audio context
     * @param id track id
     * @param name name of song (filename, url name, ...)
     */
    constructor(ctx, id, name) {
        // Calling constructor of HTMLElement (must happen before anything else)
        super();

        // --------------------------------------------------
        // LOGIC + DATA
        // --------------------------------------------------

        // audio context
        this.audioCtx = ctx;

        // set id
        this.id = id;

        // set name
        this.name = name;

        // AudioBufferSourceNode which is needed to reload the buffer into this.source
        this.reusableBuffer;

        // central element of AudioTrack - this is the actual audiodata which is then used for playback & effetcs
        this.source;

        // declare initial values regarding playback
        this.isPlaying = false;
        this.isLooping = false;
        this.startTime = 0;
        this.playbackTime = 0;
        this.lengthOfTrack;

        // initial values regarding effects: new AudioTrack will use these values;
        // those values are also needed to restore effects after `pause`
        this.volumeLevel = 1;
        this.lowshelfValue = 0;
        this.bandpassValue = 10000;
        this.highshelfValue = 20000;
        this.playbackRate = 1;
        this.delayValue = 0;
        this.reverbDryWetValue = 0.0;
        this.reverbFeedbackValue = 0.0;
        this.reverbLowpass = 200;

        // declare all the nodes necessary to implement effects
        this.gainNode;                      // for volume
        this.lowshelfNode;                   // for lowpass filter
        this.bandpassNode;                  //for bandpass filter
        this.highshelfNode;                  // for high pass filter
        this.delayNode;                     // for delay


        this.convolverNode;                 // for reverb
        this.formAnalyser;                  // for analyzing & drawing wave form
        this.freqAnalyser;                  // for analyzing & drawing frequency bars


        // --------------------------------------------------
        // GUI (web component things)
        // --------------------------------------------------

        // create shadowDOM and load html into it
        let shadowRoot = this.attachShadow({ mode: 'open' });
        //let html = loadhtml('../../html/audiotrack.html');
        shadowRoot.innerHTML = this.template();

        // set track title
        //shadowRoot.getElementById('title').textContent = name;

        // initialize all gui elements
        this.initGui();
    }

    template() {
        const html = String.raw;

        return html`
            <div class="audiotrack">
            <div id="progress-bar">
            </div>
            <div id="controls">
                <button id="audioPlayback" data-playing="false" role="switch" aria-checked="false">
                    <span>Play/Pause</span>
                </button>
                <input class="slider" id="volume" type="range" min="0" max="127">
                <div id="progress">
                    <span id="currenttime" class="progressinfo"></span>
                    <input type="range" class="slider" id="progressID" min="0" max="127" step="0.01">
                    <span id="endtime" class="progressinfo"></span>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Extended constructor;
     * initializes all gui elements
     */
    initGui() {
        // make 'this' available inside the functions
        let self = this;

        // --------------------------------------------------
        // BUTTONS
        // --------------------------------------------------

        this.playBtn = this.shadowRoot.getElementById('audioPlayback');
        //this.stopBtn = this.shadowRoot.getElementById('audioPlayback');

        this.playBtn.addEventListener('click', function () {
            self.togglePlayback();
        });
        /*this.stopBtn.addEventListener('click', function () {
            self.stopPlayback();
        });*/


        // --------------------------------------------------
        // VOLUME SLIDER
        // --------------------------------------------------

        this.volumeSlider = this.shadowRoot.getElementById('volume');
        this.volumeSlider.value = this.volumeLevel * 127;
        this.volumeSlider.addEventListener('input', function () {
            self.changeVolume(self.volumeSlider.value);
        });

        // --------------------------------------------------
        // PROGRESS SLIDER
        // --------------------------------------------------

        this.progressBar = this.shadowRoot.getElementById('progressID');
        this.currentTimeLabel = this.shadowRoot.getElementById('currenttime');
        this.trackDurationLabel = this.shadowRoot.getElementById('endtime');
        this.currentTimeLabel.textContent = '00:00';
        this.progressBar.value = 0;
        this.progressBar.addEventListener('input', function () {
            self.setCurrentPBTime(self.progressBar.value);
        });

        let tPFS, tActual, tNext, pStart, tPassed;

        this.startDrawingProgressBar = function (fps) {
            tPFS = 1 / fps;
            tNext = self.audioCtx.currentTime;
            pStart = tNext;
            this.drawProgressBar();
        };

        this.drawProgressBar = function () {
            requestAnimationFrame(self.drawProgressBar);
            tActual = self.audioCtx.currentTime;
            tPassed = tActual - tNext;
            if (tPassed > tPFS && self.isPlaying) {
                tNext = tActual - (tPassed % tPFS);
                self.playbackTime += (self.audioCtx.currentTime - self.startTime) * self.playbackRate;
                self.startTime = self.audioCtx.currentTime;
                if (self.playbackTime > self.lengthOfTrack)
                    self.playbackTime -= self.lengthOfTrack;

                self.updateCurrentTimeLabel();
            }
        };

        this.updateCurrentTimeLabel = function () {
            let time = (self.audioCtx.currentTime - self.startTime + self.playbackTime) / self.lengthOfTrack;
            self.progressBar.value = time * 127;
            let minute = Math.floor(time / 60 * self.lengthOfTrack);
            let second = Math.floor(time % 60 * self.lengthOfTrack) - (minute * 60);
            if (minute < 10)
                minute = '0' + minute.toString();
            if (second < 10)
                second = '0' + second.toString();
            self.currentTimeLabel.textContent = minute + ':' + second;
        }
    }

    /**
     * Loads local file into buffer
     *
     * @param file local file to load
     */
    loadFileIntoBuffer(file) {
        console.log(file)
            let self = this;
            let bufferSource = this.audioCtx.createBufferSource();
            let fr = new FileReader();
            fr.onload = function () {

                self.audioCtx.decodeAudioData(fr.result, function (buffer) {
                    bufferSource.buffer = buffer;
                    self.lengthOfTrack = buffer.duration;
                    let minute = Math.floor(self.lengthOfTrack / 60);
                    if (minute < 10)
                        minute = '0' + minute.toString();
                    let second = Math.floor(self.lengthOfTrack % 60);
                    if (second < 10)
                        second = '0' + second.toString();
                    //self.lengthOfTrackLabel.textContent = minute + ':' + second;
                });
            };
            fr.readAsArrayBuffer(file);

            this.reusableBuffer = bufferSource;

            // Load the default reverb file
            //this.getImpulse('res/impulseresponses/kinoull_aisle_ir_edit.wav');
    }

    /**
     * Toggles playback
     */
    togglePlayback() {
        console.log("TOGGLE PLAY: " + this.source)
        if (this.source == null || this.source == undefined)
            this.isPlaying = false;

        if (this.isPlaying == false) {
            this.startPlayback();
        } else if (this.isPlaying == true) {
            this.pausePlayback();
        }
    }

    /**
     * Starts playback
     */
    startPlayback() {
        console.log('starting at ' + this.playbackTime);
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = this.reusableBuffer.buffer;
        this.initNodes();
        this.startTime = this.audioCtx.currentTime;
        this.source.start(0, this.playbackTime);
        this.isPlaying = true;
        this.source.loop = this.isLooping;
        this.startDrawingProgressBar(5);


        let self = this;
        this.source.addEventListener('ended', this.whenTrackEnded = function () {
            console.log('ended');
            self.isPlaying = false;
            self.playbackTime = 0;
        })
    }

    /**
     * Pauses playback
     */
    pausePlayback() {
        this.playbackTime += (this.audioCtx.currentTime - this.startTime) * this.playbackRate;
        console.log('pausing at ' + this.playbackTime);
        this.isPlaying = false;
        this.source.removeEventListener('ended', this.whenTrackEnded);
        this.source.stop(0);
    }

    /**
     * Stops playback
     */
    stopPlayback() {
        if (this.source != undefined) {
            console.log('stopping');
            this.playbackTime = 0;
            this.isPlaying = false;
            this.source.stop(0);
            //this.progressBar.value = 0;
        }
    }

    /**
     * Initializes and connects all nodes
     */
    initNodes() {
        // --------------------------------------------------
        // INITIALIZE NODES
        // --------------------------------------------------

        // volume
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = this.volumeLevel;

        //HIER KOMMEN NOCH ALLE ANDEREN NODES/FILTE DAZU

        // --------------------------------------------------
        // CONNECT NODES
        // --------------------------------------------------

        //JEDER NODE MUSS HIER NOCH CONNECTED WERDEN
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);

    }

    /**
     * Changes volume
     *
     * @param value Value from midicontroller or gui-slider (0 - 127)
     */
    changeVolume(level) {
        this.volumeLevel = level / 127;
        this.volumeSlider.value = level;
        //this.volumeLabel.textContent = 'volume: ' + Math.floor(this.volumeLevel * 100) + '%';
        if (this.source != null)
            this.gainNode.gain.setValueAtTime(this.volumeLevel, this.audioCtx.currentTime);
        //this.volumeLabel.textContent = Math.floor(this.volumeLevel * 100) + '%';
    }

    /**
     * Change current Time of Track to speicific position
     *
     * @param controller Input or input from Progress-Bar
     */
    setCurrentPBTime(value) {
        if (this.isPlaying) {
            this.togglePlayback();
            this.playbackTime = this.lengthOfTrack * value / 127;
            this.startTime = this.audioCtx.currentTime;
            this.togglePlayback();
        } else {
            this.playbackTime = this.lengthOfTrack * value / 127;
            this.startTime = this.audioCtx.currentTime;
        }
        this.updateCurrentTimeLabel();
    }

    getIdByName(name) {
        if (this.name === name) {
            return this.id;
        }
        return false;
    }



}

customElements.define('audio-track', AudioTrack);

import TrackManager from '../TrackManager.js';
import contentLoader from "../utils/contentLoader.js";

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

        this.lowshelfVal = 0;
        this.highshelfVal = 20000;
        this.bandpassVal = 10000;

        // initial values regarding effects: new AudioTrack will use these values;
        // those values are also needed to restore effects after `pause`
        this.volumeLevel = 1;
        this.playbackRate = 1;
        this.bitcrusherBitSize = 16;
        this.bitcrusherNormFreq = 1.0;
        this.lowshelfNode;
        this.highshelfNode;
        this.bandpassNode;

        //Visuals
        this.formAnalyser;

        // declare all the nodes necessary to implement effects
        this.gainNode;                      // for volume
        this.bitcrusherNode;                //For Bitcrusher


        // --------------------------------------------------
        // GUI (web component things)
        // --------------------------------------------------

        // create shadowDOM and load html into it
        let htmlTemplate = contentLoader("../../html/AudioTrackTemplate.html");
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = htmlTemplate;

        // set track title
        //shadowRoot.getElementById('title').textContent = name;

        // initialize all gui elements
        this.initGui();

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


        this.removeButton = this.shadowRoot.getElementById('removeTrack');

        this.removeButton.addEventListener('click', function () {
            self.stopPlayback();
            self.shadowRoot.innerHTML = null;
            TrackManager.deleteAudioTrack(self.id);
        });


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
        };

        /**
         * PLAYBACK SPEED
         */
        this.playbackRateSlider = this.shadowRoot.getElementById('playbackspeedslider');
        this.playbackRateLabel = this.shadowRoot.getElementById('playbackrate');

        this.playbackRateSlider.addEventListener('input', function () {
            console.log("TEST");
            self.changeSpeed(self.playbackRateSlider.value);
        });

        this.playbackRateSlider.value = 25;
        this.playbackRateLabel.textContent = this.playbackRate + 'x';


        /**
         * BITCRUSHER SLIDERS
         * currently no sliders, only button
        */
        this.bitcrusherBitSizeSlider = this.shadowRoot.getElementById('bitcrusherBitsSlider');
        this.bitcrusherBitSizeLabel = this.shadowRoot.getElementById('bitcrusherBitsLabel');
        this.bitcrusherNormFreqSlider = this.shadowRoot.getElementById('bitcrusherNormFreqSlider');
        this.bitcrusherNormFreqLabel = this.shadowRoot.getElementById('bitcrusherNormFreqLabel');

        this.bitcrusherBitSizeSlider.addEventListener('input', function () {
            self.bitcrusherBitSizeLabel.innerText = ("Bit-Size: " + self.bitcrusherBitSizeSlider.value);
            self.changeBitcrusher(self.bitcrusherBitSizeSlider.value, self.bitcrusherNormFreqSlider.value);
        });
        this.bitcrusherNormFreqSlider.addEventListener('input', function () {
            self.bitcrusherNormFreqLabel.innerText = ("Norm-Frequency: " + self.bitcrusherNormFreqSlider.value);
            self.changeBitcrusher(self.bitcrusherBitSizeSlider.value, self.bitcrusherNormFreqSlider.value);
        });

        //this.bitcrusherBitSizeSlider = this.shadowRoot.getElementById('bitcrusherBitsSlider');


        /**
         * LOWSHELF SLIDERS
         * @type {HTMLElement}
         */

        this.lowshelfSlider = this.shadowRoot.getElementById('lowshelfslider');
        this.lowshelfFreqLabel = this.shadowRoot.getElementById('lowshelffreqlabel');

        this.lowshelfSlider.addEventListener('input', function () {
            self.changeLowshelf(self.lowshelfSlider.value);
        });

        this.lowshelfSlider.value = 0;
        this.lowshelfFreqLabel.textContent = this.lowshelfVal + 'Hertz';

        /**
         * Highshelf Web-Elements
         * @type {HTMLElement}
         */

        this.highshelfSlider = this.shadowRoot.getElementById('highshelfslider');
        this.highshelfLabel = this.shadowRoot.getElementById('highshelffreqLabel');

        this.highshelfSlider.addEventListener('input', function () {
            self.changeHighshelf(self.highshelfSlider.value);
        });

        this.highshelfSlider.value = this.highshelfVal;
        this.highshelfLabel.textContent = this.highshelfVal + 'Hz';

        /**
         * Bandpass Web-Elements
         * @type {HTMLElement}
         */
        this.bandpassValSlider = this.shadowRoot.getElementById('bandpassValSlider');
        this.bandpassFreqLabel = this.shadowRoot.getElementById('bandpassfreq');

        this.bandpassValSlider.addEventListener('input', function () {
            self.changeBandpass(self.bandpassValSlider.value);
        });

        this.bandpassValSlider.value = this.bandpassVal / 20000 * 127;
        this.bandpassFreqLabel.textContent = Math.floor(this.bandpassVal) + 'Hz';

        /**
         * VISAULIZER
         * @type {HTMLElement}
         */

        this.visualizerCanvas = document.getElementById('visualCanvas');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');

        this.VISUALIZERWIDTH = this.visualizerCanvas.width;
        this.VISUALIZERHEIGHT = this.visualizerCanvas.height;

        let wFpsInterval, wNow, wThen, wStart, wElapsed;

        this.initDrawVisuals = function (fps) {
            wFpsInterval = 1 / fps;
            wThen = self.audioCtx.currentTime;
            wStart = wThen;
            this.drawVisual();
        };

        this.drawVisual = function () {
            requestAnimationFrame(self.drawVisual);
            wNow = self.audioCtx.currentTime;
            wElapsed = wNow - wThen;
            if (wElapsed > wFpsInterval && self.isPlaying) {
                wThen = wNow - (wElapsed % wFpsInterval);
                // draw
                self.visualizerCtx.clearRect(0, 0, self.VISUALIZERWIDTH, self.VISUALIZERHEIGHT);
                self.formAnalyser.getByteTimeDomainData(self.visualizerDataArr);

                self.visualizerCtx.fillStyle = '#1d1e1f';
                self.visualizerCtx.fillRect(0, 0, self.VISUALIZERWIDTH, self.VISUALIZERHEIGHT);
                self.visualizerCtx.lineWidth = 2;
                self.visualizerCtx.strokeStyle = '#efefef';
                self.visualizerCtx.beginPath();
                let sliceWidth = self.VISUALIZERWIDTH * 1.0 / self.visualizerBufferSize;
                let x = 0;
                for (let i = 0; i < self.visualizerBufferSize; i++) {
                    var v = self.visualizerDataArr[i] / 128.0;
                    var y = v * self.VISUALIZERHEIGHT / 2;

                    if (i === 0) {
                        self.visualizerCtx.moveTo(x, y);
                    } else {
                        self.visualizerCtx.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
                self.visualizerCtx.lineTo(self.VISUALIZERWIDTH, self.VISUALIZERHEIGHT / 2);
                self.visualizerCtx.stroke();
            }
        };

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
        this.initDrawVisuals(30);


        let self = this;
        this.source.addEventListener('ended', this.whenTrackEnded = function () {
            console.log('ended');
            self.isPlaying = false;
            self.playbackTime = 0;
            self.visualizerCtx.clearRect(0, 0, self.VISUALIZERWIDTH, self.VISUALIZERHEIGHT);

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
            this.visualizerCtx.clearRect(0, 0, this.VISUALIZERWIDTH, this.VISUALIZERHEIGHT);
            this.source.stop(0);
            //this.progressBar.value = 0;
        }
    }

    /**
     * Change Playback Speed of Current Audiotrack     *
     * @param Current Value from midicontroller or slider
     */
    changeSpeed(value) {
        let isPlayingBefore = this.isPlaying;
        if (isPlayingBefore)
            this.togglePlayback();

        this.playbackRate = value / 127 * 5;
        if (this.source != null)
            this.source.playbackRate.value = this.playbackRate;
        this.playbackRateSlider.value = value;
        this.playbackRateLabel.textContent = (this.playbackRate).toFixed(2) + 'x';

        if (isPlayingBefore)
            this.togglePlayback();
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

        //Playbackrate
        this.source.playbackRate.value = this.playbackRate;

        //Bitcrusher
        this.bitcrusherNode = this.audioCtx.createScriptProcessor(4096, 1, 1);
        //this.changeBitcrusher(this.bitcrusherBitSize, this.bitcrusherNormFreq); //Initialize the Bitcrusher with default/no effect


        //Initializing the lowshelf filter
        this.lowshelfNode = this.audioCtx.createBiquadFilter();
        this.lowshelfNode.type = 'lowshelf';
        this.lowshelfNode.frequency.value = this.lowshelfVal;
        this.lowshelfNode.gain.value = -12;

        //Initialize the highshelf filter
        this.highshelfNode = this.audioCtx.createBiquadFilter();
        this.highshelfNode.type = 'highshelf';
        this.highshelfNode.frequency.value = this.highshelfVal;
        this.highshelfNode.gain.value = -12;

        //Initialize the bandpass filter
        this.bandpassNode = this.audioCtx.createBiquadFilter();
        this.bandpassNode.type = "peaking";
        this.bandpassNode.frequency.value = 1000.0;
        this.bandpassNode.Q.value = 700;

        //Initialize the Visualizer
        this.formAnalyser = this.audioCtx.createAnalyser();
        this.formAnalyser.fftSize = 2048;
        this.visualizerBufferSize = this.formAnalyser.frequencyBinCount;
        this.visualizerDataArr = new Uint8Array(this.visualizerBufferSize);

        /**
         * Succeedingly Connect all Nodes together
         */
        //Connect Filters and EQs
        this.source.connect(this.lowshelfNode);
        this.lowshelfNode.connect(this.bandpassNode);
        this.bandpassNode.connect(this.highshelfNode);
        this.highshelfNode.connect(this.gainNode);
        //Bitcrusher currently disabled
        this.bitcrusherNode.connect(this.audioCtx.destination);

        //Connect Outputs
        this.gainNode.connect(this.formAnalyser);
        this.gainNode.connect(this.audioCtx.destination);
    }

    /**
     * Bitcrusher
     *
     * This works by quantizing the input signal.
     * In other words, it samples the input signal every so often,
     * then “holds” that sample until it’s time to sample again (based on the bits and normfreq settings).
     */
    changeBitcrusher(bits, normfreq){


        if(this.bitcrusherNode.onaudioprocess != null){
            console.log("NOT NULL");
            this.bitcrusherNode.onaudioprocess = null;
            this.gainNode.connect(this.audioCtx.destination);
            //this.changeBitcrusher(bits, normfreq);

        }

        this.bitcrusherNode.bits = bits; // between 1 and 16
        this.bitcrusherNode.normfreq = normfreq; // between 0.0 and 1.0

        this.bitcrusherNode.onaudioprocess = function(e) {
            var step = Math.pow(1/2, e.srcElement.bits);
            var phaser = 0;
            var last = 0;
            console.log("Normfreq: " + e.srcElement.normfreq);
            console.log("Bitsize: " + e.srcElement.bits);

            var input = e.inputBuffer.getChannelData(0);
            var output = e.outputBuffer.getChannelData(0);
            for (var i = 0; i < e.inputBuffer.length; i++) {
                phaser += e.srcElement.normfreq;
                if (phaser >= 1.0) {
                    phaser -= 1.0;
                    last = step * Math.floor(input[i] / step + 0.5);
                }
                output[i] = last;
            }
        };


        this.gainNode.connect(this.bitcrusherNode);
        this.bitcrusherNode.connect(this.audioCtx.destination);

    };

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

    /**
     * Alter the frequency of the lowshelf Node
     *
     * @param value Value from midicontroller or gui-slider (0 - 127)
     */
    changeLowshelf(value) {
        let step = 20000 / 127;
        this.lowshelfVal = value * step;
        if (this.source != null)
            this.lowshelfNode.frequency.value = this.lowshelfVal;
        this.lowshelfSlider.value = value;
        this.lowshelfFreqLabel.textContent = Math.floor(this.lowshelfVal) + 'Hertz';
    }

    /**
     * Alter the frequency of the highshelf Node
     *
     * @param value Value from midicontroller or gui-slider (0 - 127)
     */
    changeHighshelf(value) {
        let step = 20000 / 127;
        this.highshelfVal = value * step;
        if (this.source != null) {
            this.highshelfNode.frequency.value = this.highshelfVal;
        }
        this.highshelfSlider.value = value;
        this.highshelfLabel.textContent = Math.floor(this.highshelfVal) + 'Hertz';
    }

    /**
     * Alter the freuquency of the bandpass Node
     *
     * @param value Value from midicontroller or gui-slider (0 - 127)
     */
    changeBandpass(value) {
        let step = 20000 / 127;
        this.bandpassVal = value * step;
        if (this.source != null) {
            this.bandpassNode.frequency.value = this.bandpassVal;
        }
        this.bandpassValSlider.value = value;
        this.bandpassFreqLabel.textContent = Math.floor(this.bandpassVal) + 'Hz';
    }

    getIdByName(name) {
        if (this.name === name) {
            return this.id;
        }
        return false;
    }



}

customElements.define('audio-track', AudioTrack);

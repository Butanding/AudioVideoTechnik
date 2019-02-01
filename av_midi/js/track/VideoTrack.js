import TrackManager from "../TrackManager.js";
import chromaKeying from "../manipulators/chromaKeying.js";

/**
 * Class to handle logic, behaviour and data of all video elements as well as gui
 */
export default class VideoTrack extends HTMLElement {

    /**
     * Constructor.... this is.
     */
    constructor(id, name) {
        // Calling constructor of HTMLElement (must happen before anything else)
        super();

        // --------------------------------------------------
        // LOGIC + DATA
        // --------------------------------------------------


        // set id
        this.id = id;


        // source which holds the video data
        this.source;

        this.videoFilter = null;

        // declare initial values regarding playback
        this.isPlaying = false;
        this.isPausing = false;
        this.isLooping = false;
        this.playbackTime = 0;
        this.lengthOfTrack;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template();

        this.audio = new Audio();
        this.audio.addEventListener(
            'timeupdate',
            this.handleAudioTimeUpdate.bind(this),
        );

        /**
         * MPEG-DASH Video-Player
         * @type {dashjs.MediaPlayerClass}
         */
        this.player = dashjs.MediaPlayer().create();
        //URL is hardcoded, because javascript cant read URL of Filesystem (Security)
        var url = "../../res/video/" + name;
        this.player.initialize(this.shadowRoot.querySelector("#videoPlayer"), url, true);

        //videoPlayer = this.shadowRoot.getElementById("video-bg");
        this.videoPlayer = this.shadowRoot.getElementById("videoPlayer");
        this.videoCanvas = shadowRoot.getElementById("canvas-video");
        this.videoCanvas.hidden = true;

        console.log(this.shadowRoot.querySelector("#videoPlayer").getBoundingClientRect);
    }

    renderVideoFilters(){
        let self = this;
        self.invert.render();
        self.chromaKey.render();
    }

    template() {
        const html = String.raw;

        return html`
            <style>
                #wrapper {
                    position: relative;
                }
                #canvas-video {
                    position: absolute;
                    background-color: yellow;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                }
                #videoPlayer {
                    position: center;
                    width: 100%;
                    height: auto;
            }
            </style>
            
            <div class="canvas-wrapper" id="wrapper">
                    <video id="videoPlayer" controls="true" ></video>
                    <canvas id="canvas-video"></canvas>
            </div>
            
            <div>                
                <button id="removeTrack" aria-checked="false">
                  <span>Remove Video</span>
                </button>
                <button id="addChromaKeying" aria-checked="false">
                  <span>Add Chroma Keying</span>
                </button>
                <button id="addInvertFilter" aria-checked="false">
                  <span>Add Invert Filter</span>
                </button>
            </div>
        `;
    }

    connectedCallback() {

        let self = this;


        this.removeButton = this.shadowRoot.querySelector("#removeTrack");

        /*
            Registriere Buttons
         */
        let chromaKeyingButton = this.shadowRoot.getElementById("addChromaKeying");
        chromaKeyingButton.addEventListener("click", function(){
            self.handleFilterBtns(chromaKeyingFilter);

        }, false);

        let invertButton = this.shadowRoot.getElementById("addInvertFilter");
        invertButton.addEventListener("click", function(){
            self.handleFilterBtns(invertFilter);

        }, false);

        this.removeButton.addEventListener('click', function () {
            self.player.reset();
            self.shadowRoot.innerHTML = null;
            TrackManager.deleteVideoTrack(self.id);
        });
    }

    handleFilterBtns(newFilter){
        let self = this;

        if(self.videoFilter == null || self.videoFilter.filter != newFilter){
            self.videoCanvas.hidden = false;
            self.videoFilter = new chromaKeying(self.videoPlayer, self.videoCanvas, newFilter, false);
            self.videoFilter.toggleFilter();
            renderVideoFilter();
        }else if(self.videoFilter == newFilter){
            self.videoCanvas.hidden = false;
            self.videoFilter.toggleFilter();
            console.log(self.videoCanvas);
        }
        else{
            self.videoCanvas.hidden = !self.videoCanvas.hidden;
            self.videoFilter.toggleFilter();
        }

        function renderVideoFilter(){
            self.videoFilter.render();
            requestAnimationFrame(renderVideoFilter);
        }
    }


    handleAudioTimeUpdate() {
        const progress = this.audio.currentTime / this.audio.duration;
        this.elProgress.style.width = (progress * 100) + '%';
    }
}

function chromaKeyingFilter(frame, length) {
    for (let i = 0; i < length; i++) {
        frame.data[i * 4 + 3] = (frame.data[i * 4 + 0] +
            frame.data[i * 4 + 1] +
            frame.data[i * 4 + 2])/ 3;
    }
}

function invertFilter(frame, length) {
    for (let i = 0; i < length; i++) {
        frame.data[i * 4 + 0] = 255 - frame.data[i * 4 + 0];
        frame.data[i * 4 + 1] = 255 - frame.data[i * 4 + 1];
        frame.data[i * 4 + 2] = 255 - frame.data[i * 4 + 2];
    }
}

customElements.define('video-player', VideoTrack);
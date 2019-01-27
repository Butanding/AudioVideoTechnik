import TrackManager from "../TrackManager.js";

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

        // declare initial values regarding playback
        this.isPlaying = false;
        this.isPausing = false;
        this.isLooping = false;
        this.playbackTime = 0;
        this.lengthOfTrack;

        // initial values regarding effects
        this.volumeLevel = 1;
        this.playbackRate = 1;
        this.monoValue = 0;
        this.blurValue = 0;
        this.colorStrengthValue = 0;
        this.redColorValue = 0;
        this.greenColorValue = 0;
        this.blueColorValue = 0;
        this.dreamValue = 0;
        this.dissolveValue = 0;
        this.isFlipped = false;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template();

        this.audio = new Audio();
        this.audio.addEventListener(
            'timeupdate',
            this.handleAudioTimeUpdate.bind(this),
        );

        var player = dashjs.MediaPlayer().create();
        //URL is hardcoded, because javascript cant read URL of Filesystem (Security)
        var url = "../../res/video/" + name;
        console.log("loading video from: " + url);

        //player.initialize(this.audio, ("../../res/video/"+name), false);


        player.initialize(this.shadowRoot.querySelector("#videoPlayer"), url, true);

    }

    template() {
        const html = String.raw;

        return html`
            <style>
                div {
                    background-color: lightgray;
                }
                #videoPlayer {
                width: 320px;
                height: 180px;
            }
            </style>
                <video id="videoPlayer" class="embed-responsive-item" controls></video>
            <div>
                <button type="button">Remove Video</button>
            </div>
        `;
    }

    connectedCallback() {
        const button = this.shadowRoot.querySelector('button');
        button.addEventListener('click', this.handleButtonClick.bind(this));
    }

    handleButtonClick() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    handleAudioTimeUpdate() {
        const progress = this.audio.currentTime / this.audio.duration;
        this.elProgress.style.width = (progress * 100) + '%';
    }
}

customElements.define('video-player', VideoTrack);
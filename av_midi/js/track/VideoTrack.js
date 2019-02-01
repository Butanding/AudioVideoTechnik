import TrackManager from "../TrackManager.js";
import videoFilter from "../manipulators/VideoFilter.js";

/**
 * Class to handle VideoTrack Element and all it's Filters
 */
export default class VideoTrack extends HTMLElement {

    /**
     * Constructor
     */
    constructor(id, name) {
        // Calling constructor of HTMLElement
        super();

        // set id
        this.id = id;
        //initialize Video-Filter (Overlaying Canvas)
        this.videoFilter = null;

        //Create and fill shadow-root
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = this.template();

        //Get all relevant nodes from shadow-root
        this.videoPlayer = this.shadowRoot.getElementById("video-element");
        this.videoCanvas = shadowRoot.getElementById("canvas-video");
        this.videoCanvas.hidden = true;

        /**
         * MPEG-DASH Video-Player: Loading and initializing
         * @type {dashjs.MediaPlayerClass}
         */
        this.player = dashjs.MediaPlayer().create();
        //URL is hardcoded, because javascript cant read URL of Filesystem (Security)
        var url = "../../res/video/" + name;
        this.player.initialize(this.videoPlayer, url, true);



    }

    /**
     * Template for shadow-dom/Custom HTML Video-Track Element
     * @returns {string}
     */
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
                #video-element {
                    position: center;
                    width: 100%;
                    height: auto;
            }
            </style>
            
            <div class="canvas-wrapper" id="wrapper">
                    <video id="video-element" controls="true" ></video>
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

    /**
     * Called upon startup to connect button-callbacks
     */
    connectedCallback() {

        let self = this;

        let chromaKeyingButton = self.shadowRoot.getElementById("addChromaKeying");
        chromaKeyingButton.addEventListener("click", function(){
            self.handleFilterBtns(chromaKeyingFilter);

        }, false);

        let invertButton = self.shadowRoot.getElementById("addInvertFilter");
        invertButton.addEventListener("click", function(){
            self.handleFilterBtns(invertFilter);

        }, false);

        let removeButton = self.shadowRoot.getElementById("removeTrack");
        removeButton.addEventListener('click', function () {
            self.player.reset();
            self.shadowRoot.innerHTML = null;
            TrackManager.deleteVideoTrack(self.id);
        });
    }

    /**
     * Function to handle the Filter Buttons: set, change or disable filter on canvas (overlaying the video)
     * @param newFilter the filter that is to be applied
     */
    handleFilterBtns(newFilter){
        let self = this;

        //if empty or different filter
        if(self.videoFilter == null || self.videoFilter.filter != newFilter){
            self.videoCanvas.hidden = false;
            self.videoFilter = new videoFilter(self.videoPlayer, self.videoCanvas, newFilter, false);
            self.videoFilter.toggleFilter();
            renderVideoFilter();
        }
        //if filter is already active, disable the filter
        else if(self.videoFilter == newFilter){
            self.videoCanvas.hidden = false;
            self.videoFilter.toggleFilter();
            console.log(self.videoCanvas);
        }
        //in all other cases invert filter-activity
        else{
            self.videoCanvas.hidden = !self.videoCanvas.hidden;
            self.videoFilter.toggleFilter();
        }

        //recursive function to repetedly update the filter on the video
        function renderVideoFilter(){
            self.videoFilter.render();
            requestAnimationFrame(renderVideoFilter);
        }
    }
}

/**
 * Function to apply chroma keying on video
 * @param frame
 * @param length
 */
function chromaKeyingFilter(frame, length) {
    for (let i = 0; i < length; i++) {
        frame.data[i * 4 + 3] = (frame.data[i * 4 + 0] +
            frame.data[i * 4 + 1] +
            frame.data[i * 4 + 2])/ 3;
    }
}

/**
 * Function to invert all frames of a video
 * @param frame
 * @param length
 */
function invertFilter(frame, length) {
    for (let i = 0; i < length; i++) {
        frame.data[i * 4 + 0] = 255 - frame.data[i * 4 + 0];
        frame.data[i * 4 + 1] = 255 - frame.data[i * 4 + 1];
        frame.data[i * 4 + 2] = 255 - frame.data[i * 4 + 2];
    }
}

customElements.define('video-player', VideoTrack);
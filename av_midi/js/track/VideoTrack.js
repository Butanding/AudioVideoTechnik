import TrackManager from "../TrackManager.js";
import videoFilter from "../manipulators/VideoFilter.js";
import contentLoader from "../utils/contentLoader.js";

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
        //Animation ID to control frame-update of canvas
        this.animationID = null;

        //Create and fill shadow-root
        let htmlTemplate = contentLoader("../../html/VideoTrackTemplate.html");
        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.innerHTML = htmlTemplate;

        //Get all relevant nodes from shadow-root
        this.videoPlayer = this.shadowRoot.getElementById("video-element");
        this.videoCanvas = shadowRoot.getElementById("canvas-video");
        this.videoCanvas.hidden = true; //Hide-Canvas on Startup, unhide later on

        this.videoMarquee = this.shadowRoot.getElementById("marquee");
        this.videoMarquee.hidden = true;


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

        let marqueeCheckbox = self.shadowRoot.getElementById("marqueeCheckbox");
        marqueeCheckbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                self.videoMarquee.hidden = false;
            } else {
                self.videoMarquee.hidden = true;
            }
        });

        let marqueeUpdateButton = self.shadowRoot.getElementById("marqueeUpdate");
        marqueeUpdateButton.addEventListener("click", function(){
            console.log("marquee Update");
            let marqueContent = self.shadowRoot.getElementById("marqueeText");
            let marqueNewContent = self.shadowRoot.getElementById("marqueeNewText");
            marqueContent.innerText = marqueNewContent.value;
        }, false);


        let removeButton = self.shadowRoot.getElementById("removeTrack");
        removeButton.addEventListener('click', function () {
            //Stop possible Animation of Canvas-Filter
            cancelAnimationFrame(self.animationID);
            //Remove Canvas
            self.videoCanvas = null;
            //Remove Dashjs Player
            self.player.reset();
            //Empty Shadow-Root
            self.shadowRoot.innerHTML = null;
            //Delete Video from Global Trackmanager
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
            self.animationID = requestAnimationFrame(renderVideoFilter);
        }
    }

    handleMarquee(){

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
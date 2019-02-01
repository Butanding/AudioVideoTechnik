class chromaKeying {


    constructor(videoEl, canvasEl, filterFunction, applyFilter) {


        console.log("Creating ChromaKeying Filter");
        this.video = videoEl;
        this.canvas = canvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.filter = filterFunction;
        this.applyFilter = applyFilter;

        /**
         * Resize Canvas
         */
        let w = this.video.offsetWidth;
        let h = this.video.offsetHeight;
        let cv = canvasEl;
        cv.width = w;
        cv.height =h;


    }

    render() {

        let self = this;

        this.ctx.drawImage(this.video,0,0, self.video.clientWidth, self.video.clientHeight);

        let frame = this.ctx.getImageData(0, 0, self.video.clientWidth, self.video.clientHeight);
        let length = frame.data.length / 4;

        if (this.applyFilter) {
            this.filter(frame, length);
        }

        this.ctx.putImageData(frame, 0, 0);

    }

    toggleFilter() {
        let self = this;

        if (this.applyFilter == true) {
            this.applyFilter = false;
            console.log("Filter deactivated: " +  this.filter.toString());
        } else {

            this.applyFilter = true;
            console.log("Chroma Filter activated" + this.filter.toString());
        }
    }


}

export default chromaKeying;
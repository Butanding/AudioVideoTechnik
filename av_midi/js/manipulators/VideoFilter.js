class videoFilter {

    /**
     * Generic filter class that will create a filter according to given-filter function
     * @param videoEl on which the Canvasian-Filter is to be applied
     * @param canvasEl that overlays the video
     * @param filterFunction that will be applied on canvas -> video
     * @param applyFilter state, a boolean to toggle the activity of the filter
     */
    constructor(videoEl, canvasEl, filterFunction, applyFilter) {

        /**
         * Initialize all Class-Variables and Parameters
         */
        this.video = videoEl;
        this.canvas = canvasEl;
        this.ctx = this.canvas.getContext("2d");
        this.filter = filterFunction;
        this.applyFilter = applyFilter;

        /**
         * Resize Canvas, to make it fit on video flawlessly
         * Be careful with bootstrap: Canvas-size might not be responsive once initialized
         * @Todo: Make Canvas Size Responsive working with Bootstrap
         */
        let w = this.video.offsetWidth;
        let h = this.video.offsetHeight;
        let cv = canvasEl;
        cv.width = w;
        cv.height =h;
    }

    /**
     * Render Function which will alter the frames and pixels of the video and overlaying canvas
     */
    render() {

        let self = this;

        this.ctx.drawImage(this.video,0,0, self.video.clientWidth, self.video.clientHeight);

        let frame = this.ctx.getImageData(0, 0, self.video.clientWidth, self.video.clientHeight);
        let length = frame.data.length / 4;

        //Apply Filter only, if wanted/toggled by user
        if (this.applyFilter) {
            this.filter(frame, length);
        }

        this.ctx.putImageData(frame, 0, 0);

    }

    /**
     * Disable/Enable filter
     */
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

export default videoFilter;
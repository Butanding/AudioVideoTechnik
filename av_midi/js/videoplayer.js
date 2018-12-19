export default class Visuaziler extends HTMLElement {

    constructor() {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = this.template();

        this.video = this.shadowRoot.getElementById("video");
        this.videoContainer = this.shadowRoot.getElementById('visualization');
        this.source = this.shadowRoot.querySelector('source');
        // Source custom Video Controls and hide the system ones
        this.video.controls = false;

        this.video.setAttribute("poster", "http://media.w3.org/2010/05/sintel/poster.png");
        this.source.setAttribute("src", "http://media.w3.org/2010/05/sintel/trailer.mp4");
        this.video.load();

    }

    template() {
        const html = String.raw;

        return html`
            <style>
            </style>
            <div>
                <div id="visualization">                    
                    <figure id="videoContainer">
                      <video id="video" controls preload="metadata" poster="" height="150" "><source></video>
                      <figcaption></figcaption>
                    </figure>
               </div>
            </div>
        `;
    }

    connectedCallback() {
        const button = document.getElementById("audioPlayback");
        button.addEventListener('click', this.handleButtonClick.bind(this));
    }

    handleButtonClick() {
        if (this.video.paused) {
            this.video.play();
        }
        else {
            this.video.pause();
        }
    }

}

customElements.define('x-player', Visuaziler);
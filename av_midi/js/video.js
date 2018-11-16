//Variable to store flag if video is supported by browser
var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
    // after browser/video validation, set up custom controls
    var videoContainer = document.getElementById('videoContainer');
    var video = document.getElementById('video');
    // Source custom Video Controls and hide the system ones
    var videoControls = document.getElementById('video-playback-controls');
    video.controls = false;

    var source = document.createElement('source');
    video.appendChild(source);

    // Display the user defined video controls
    videoControls.style.display = 'block';

    // Video Controls
    var playpause = document.getElementById('playpause');
    var stop = document.getElementById('stop');

    var playbackfaster = document.getElementById('faster');
    var playbackslower = document.getElementById('slower');
    var currentspeed = document.getElementById('currentspeed');

    var jumpahead = document.getElementById('jumpahed');
    var jumpbehind = document.getElementById('jumpbehind');
    var jumptopos = document.getElementById('jumptopos');

    var progress = document.getElementById('progress');
    var progressBar = document.getElementById('progress-bar');

    //Audio controls
    var mute = document.getElementById('mute');
    var volinc = document.getElementById('volinc');
    var voldec = document.getElementById('voldec');

    //Video Channels
    var videochannels =
        [
            [
                "http://media.w3.org/2010/05/sintel/poster.png",
                "http://media.w3.org/2010/05/sintel/trailer.mp4"
            ],
            [
                "http://media.w3.org/2010/05/bunny/poster.png",
                "http://media.w3.org/2010/05/bunny/trailer.mp4"
            ],
            [
                "http://media.w3.org/2010/05/bunny/poster.png",
                "http://media.w3.org/2010/05/bunny/movie.mp4"
            ]
        ];
    var changevideo = document.getElementById('changevideo');
    var currentchannel = 0;
    nextVideo();

    //Looping Videos
    var startloop = document.getElementById('startsec');
    var stoploop = document.getElementById('stopsec');
    var loop = document.getElementById('loop');
    var loopremove = document.getElementById('deloop');

    addEventListeners();

    function addEventListeners(){

        playpause.addEventListener('click', function(e) {
            if (video.paused || video.ended) video.play();
            else video.pause();
        });

        stop.addEventListener('click', function(e) {
            video.pause();
            video.currentTime = 0;
            progress.value = 0;
        });

        mute.addEventListener('click', function(e) {
            video.muted = !video.muted;
        });

        volinc.addEventListener('click', function(e) {
            alterVolume('+')
        });
        voldec.addEventListener('click', function(e) {
            alterVolume('-')
        });

        playbackslower.addEventListener('click', function(e) {
            video.playbackRate -= 0.1;
            currentspeed.textContent = 'Current Playback Speed: ' + video.playbackRate;
        });

        playbackfaster.addEventListener('click', function(e) {
            video.playbackRate +=0.1;
            currentspeed.textContent = 'Current Playback Speed: ' + video.playbackRate;

        });

        jumpahead.addEventListener('click', function(e) {
            video.currentTime += 10;
        });

        jumpbehind.addEventListener('click', function(e) {
            video.currentTime -= 10;
        });

        jumptopos.addEventListener('click', function(e) {
            video.currentTime = 50;
        });

        //Init Progress Bar to work hand in hand with video
        video.addEventListener('loadedmetadata', function() {
            progress.setAttribute('max', video.duration);
        });

        video.addEventListener('timeupdate', function() {
            progress.value = video.currentTime;
            progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        });

        video.addEventListener('timeupdate', function() {
            if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
            progress.value = video.currentTime;
            progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
        });

        //Skip ahead to video-position
        progress.addEventListener('click', function(e) {
            var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth;
            video.currentTime = pos * video.duration;
        });

        changevideo.addEventListener('click', function() {
            nextVideo();
        });

        loop.addEventListener('click', function (e) {

            video.addEventListener('timeupdate', looping = function () {
                if(video.currentTime >= stoploop.value) {
                    video.currentTime = startloop.value;
                }
            });
        });

        loopremove.addEventListener('click', function(e){
            video.removeEventListener('timeupdate', looping);
        });


    }

    function alterVolume(dir) {
        var currentVolume = Math.floor(video.volume * 10) / 10;
        if (dir === '+') {
            console.log('Volume ++ ' + currentVolume);
            if (currentVolume < 1) video.volume += 0.1;
        }
        else if (dir === '-') {
            console.log('Volume -- ' + currentVolume);
            if (currentVolume > 0) video.volume -= 0.1;
        }
    }

    function nextVideo() {
        var figcaption = videoContainer.getElementsByTagName('figcaption')[0];
        currentchannel++;
        if (currentchannel >= videochannels.length) currentchannel = 0;
        video.setAttribute("poster", videochannels[currentchannel][0]);
        source.setAttribute("src", videochannels[currentchannel][1]);
        figcaption.textContent = videochannels[currentchannel][1];
        video.load();
    }


}


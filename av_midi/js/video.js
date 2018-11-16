//Variable to store flag if video is supported by browser
var supportsVideo = !!document.createElement('video').canPlayType;

if (supportsVideo) {
    // after browser/video validation, set up custom controls
    var videoContainer = document.getElementById('videoContainer');
    var video = document.getElementById('video');
    var videoControls = document.getElementById('video-playback-controls');

    // Hide the default controls
    video.controls = false;

    // Display the user defined video controls
    videoControls.style.display = 'block';

    // Video Controls
    var playpause = document.getElementById('playpause');
    var stop = document.getElementById('stop');
    //Progress Properties
    var progress = document.getElementById('progress');
    var progressBar = document.getElementById('progress-bar');

    var playbackfaster = document.getElementById('faster');
    var playbackslower = document.getElementById('slower');
    var currentspeed = document.getElementById('currentspeed');

    var jumpahead = document.getElementById('jumpahed');
    var jumpbehind = document.getElementById('jumpbehind');
    var jumptopos = document.getElementById('jumptopos');

    //Audio controls
    var mute = document.getElementById('mute');
    var volinc = document.getElementById('volinc');
    var voldec = document.getElementById('voldec');

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
    };

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
}


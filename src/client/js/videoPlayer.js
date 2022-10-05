const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullscreenBtn = document.getElementById("fullscreen")
const videoContainer = document.getElementById("videoContainer")
const videoControls = document.getElementById("videoControls")

let volumeValue = 0.5;
video.volume = volumeValue;

let controlsTimeout = null;
let controlsMovementTimeout = null;

const handlePlay = (event) => {
    if(video.paused){
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fa fa-play" : "fa fa-pause";
};
const handleMute = (event) => {
    if(video.muted){
        video.muted = false;
    } else{
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ? "fa fa-volume-high" : "fa-solid fa-volume-xmark";
    volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
    const {target:{value}} = event;
    if(video.muted){
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    if(value===0){
        video.muted = true;
        muteBtn.innerText = "Unmute";
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) => 
    new Date(seconds * 1000).toISOString().substr(14,5);

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (event) => {
    const {target: {value}} = event;
    video.currentTime = value;
}

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullscreenBtn.innerText = "Enter Fullscreen"
    } else{
        videoContainer.requestFullscreen();
        fullscreenBtn.innerText = "Exit Fullscreen"
    }
}

const hideControls = () => videoControls.classList.remove("Showing");
const handleMouseMove = () => {
    if(controlsTimeout){
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if(controlsMovementTimeout){
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControls.classList.add("Showing");
    controlsMovementTimeout = setTimeout(hideControls,3000);
}
const handleMouseLeave = () => {
    controlsTimeout = setTimeout(hideControls, 3000);
}

const handleEnded = async () => {
    const {id} = videoContainer.dataset;
    await fetch(`/api/videos/${id}/views`, {method:"post"})
}

playBtn.addEventListener("click", handlePlay);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("canplay", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended",handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullscreen.addEventListener("click", handleFullscreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
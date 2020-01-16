const videoContext = document.querySelector('.video-with-custom-control');
const videoProgress = document.querySelector('.video-control__progress');
const playButton = document.querySelector('.video-control__play-button');
const subtitles = document.querySelector('.video-control__subtitles');

const play = () => videoContext.paused ? videoContext.play() : videoContext.pause();

const videoProgressInc = () => videoProgress.value = (videoContext.currentTime / videoContext.duration) * 100;

const setSubtitle = (subtitle) => {
    if (videoContext.currentTime >= subtitle.startTime && subtitles.innerText !== subtitle.text) {
        subtitles.innerText = subtitle.text;
    }
};

const videoTimeUpdate = () => {
    videoProgressInc();

    if (videoContext.textTracks[0].cues) {
        Object.keys(videoContext.textTracks[0].cues)
            .forEach(key => setSubtitle(videoContext.textTracks[0].cues[key]));
    }
};

playButton.addEventListener('click', play);
videoContext.ontimeupdate = () => videoTimeUpdate();


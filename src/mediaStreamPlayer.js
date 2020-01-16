import {CONSTRAINTS, NOT_FOUND_VIDEO_DEVICE} from './constant.js';

const videoContext = document.querySelector('.video-with-media-stream');
let mediaStream = null;

const hasGetUserMedia = () => !!(navigator.getUserMedia || (navigator.mediaDevices && navigator.mediaDevices.getUserMedia));

const getUserMediaStream = () => {
    if (navigator.getUserMedia) {
        return new Promise((resolve, reject) => {
            navigator.getUserMedia(CONSTRAINTS, resolve, reject);
        });
    } else {
        return Promise.reject(NOT_FOUND_VIDEO_DEVICE);
    }
};

const startStream = async () => {
    if (!hasGetUserMedia) {
        throw new Error(NOT_FOUND_VIDEO_DEVICE);
    }

    mediaStream = await getUserMediaStream();
    videoContext.srcObject = mediaStream;
    videoContext.play();
};

startStream().then(() => console.info('Start stream'));




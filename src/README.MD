# Нативный плеер
Для работы с нативным плеером, достаточно использовать элемент <video> и добавить необходимые атрибуты.
Так же нативный плеер реализует функцию чтения субтитров. Для этого не обходимо в нуторь элемента <video> положить элемент <track>, задать необходимые параметры.

К субтитрам можно применить узкий список css-свойст:
- color
- font
- line-height
- opacity
- outline
- ruby-position
- text-combine-upright
- text-decoration
- text-shadow
- visibility
- white-space
- background
    
```html
    <video class="video-with-native-control" src="world.mp4" controls>
      <track default kind="captions" srclang="en" label="English" src="subtitles.vtt" />
      <track kind="captions" srclang="ru" src="subtitles.vtt" />
    </video>
``` 
Кастомизация субтитров
```css
    .video-with-native-control::cue {
        color: red;
    }
```
# Создание своих UI-элементов для контроля видео
  Мы так же можем не использовать нативные контролы, а создать свои и с помощью стилей задать позицию, повесить обработчики событий и управлять видео контекстом
```html
    <video class="video-with-custom-control" src="world.mp4">
      <track default kind="captions" srclang="en" src="subtitles.vtt" />
    </video>
    <div class="video-control" >
      <span class="video-control__subtitles"></span>
      <div class="video-control__button">
        <button class="video-control__play-button">play</button>
        <progress class="video-control__progress" value="0" max="100"></progress>
      </div>
    </div>
``` 
Для управления видео контекстом предостовляеться простой и понятный интерфейс. Ниже пример pause/play, и получения субтитров из видео.
```javascript
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
```
Так же елемент <video> может работать со стримом. Для этого необходимо передать MediaStream в srcObject видео контекста
```javascript
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
```

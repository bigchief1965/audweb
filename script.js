var pink;
var white;
var brown;
var track1;
var track2;
var track3;
let incr = 1;
const laodin = document.querySelector("#lodin")

// thank you developer.mozilla.org
//console.clear();
let audioCtx = null;
const loadButton = document.querySelector("#loadbutton");
const trackEls = document.querySelectorAll("li");
console.log(trackEls);
async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}
async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}
let offset = 0;
function playTrack(audioBuffer) {
  const trackSource = new AudioBufferSourceNode(audioCtx, {
    buffer: audioBuffer,
  });
  trackSource.connect(audioCtx.destination);
  trackSource.loop = true;
  if (offset == 0) {
    trackSource.start();
    offset = audioCtx.currentTime;
  } else {
    trackSource.start(0, audioCtx.currentTime - offset);
  }
  return trackSource;
}
//LOAD ALL THE FILES INTO ME VARIABLES
loadButton.addEventListener("click", () => {
  if (audioCtx != null) {
    return;
  }
  audioCtx = new AudioContext();
  trackEls.forEach((el, i) => {
    const anchor = el.querySelector("a");
    loadFile(anchor.href).then((track) => {
      if(incr === 1) {
        track1 = track;
      } else if(incr === 2) {
        track2 = track;
      } else if(incr === 3) {
        track3 = track;
      } else {
        console.log("track load error");
      }
      incr++;
      el.dataset.loading = "false";
    });
  });
  pink = track1;
  white = track2;
  brown = track3;
  laodin.innerHTML = "loadided";
});

//eek pnb999.2
const audioText = document.getElementById("audioText");
let currentAudio = pink;
let currentAudioP;
let playing = false;
let wasPlaying = false;

function playPause() {
  if(playing === false) {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    currentAudioP = playTrack(currentAudio);
    playing = true;
  } else {
    currentAudioP.stop();
    playing = false;
  }
}
function pauseEverything() {
  try {
    currentAudioP.stop();
  } catch (err) {
    console.log("dobetter");
  }
}
function amButton(audio) {
  if(currentAudio === audio) {
      wasPlaying = true;
  } else {
      wasPlaying = false;
      currentAudio = audio;
  }
  switch(currentAudio) {
    case pink:
        audioText.innerHTML = "pink noise";
        break;
    case white:
        audioText.innerHTML = "white noise";
        break;
    case brown:
        audioText.innerHTML = "brown noise";
        break;
  }
  //pauseEverything();
  playPause();
  if(playing === false && wasPlaying === false) {
      playPause();
  }
}
const loadText = document.querySelector(".loading-text");

//thank you mdn web docs developer.mozilla.org
//console.clear();

let audioCtx = null;

// Provide a start button so demo can load tracks from an event handler for cross-browser compatibility
const loadButton = document.querySelector("#loadbutton");
console.log(loadButton);

// Select all list elements
const trackEls = document.querySelectorAll("li");
console.log(trackEls);

// Loading function for fetching the audio file and decode the data
async function getFile(filepath) {
  const response = await fetch(filepath);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Function to call each file and return an array of decoded files
async function loadFile(filePath) {
  const track = await getFile(filePath);
  return track;
}

let offset = 0;
// Create a buffer, plop in data, connect and play -> modify graph here if required
//play track
function playTrack(audioBuffer) {
  const trackSource = new AudioBufferSourceNode(audioCtx, {
    buffer: audioBuffer,
  });
  trackSource.connect(audioCtx.destination);
  //eek
  trackSource.loop = true;

  if (offset == 0) {
    trackSource.start();
    offset = audioCtx.currentTime;
  } else {
    trackSource.start(0, audioCtx.currentTime - offset);
  }

  return trackSource;
}

//load the tracks
loadButton.addEventListener("click", () => {
  if (audioCtx != null) {
    return;
  }

  audioCtx = new AudioContext();

  document.querySelector("#loadbutton").hidden = true;

  trackEls.forEach((el, i) => {
    // Get children
    const anchor = el.querySelector("a");
    //const loadText = el.querySelector("p");
    const playButton = el.querySelector(".playbutton");

    // Load file
    loadFile(anchor.href).then((track) => {
      el.dataset.loading = "false";

      // Allow play on click
      playButton.addEventListener("click", () => {
        // check if context is in suspended state (autoplay policy)
        if (audioCtx.state === "suspended") {
          audioCtx.resume();
        }

        playTrack(track);
        playButton.dataset.playing = true;
      });
    });
  });
});
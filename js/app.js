document.getElementById("year").textContent = new Date().getFullYear();

const audio = document.getElementById("music-audio");
const playButton = document.getElementById("play-button");
const playIcon = document.getElementById("play-icon");
const progress = document.getElementById("track-progress");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");
const volumeControl = document.getElementById("volume-control");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

function updatePlaybackDisplay() {
  const duration = audio.duration;
  const current = audio.currentTime || 0;
  currentTimeLabel.textContent = formatTime(current);
  totalTimeLabel.textContent = formatTime(duration);

  if (Number.isFinite(duration) && duration > 0) {
    progress.value = String((current / duration) * 100);
  } else {
    progress.value = "0";
  }
  progress.setAttribute("aria-valuetext", formatTime(current) + " of " + formatTime(duration));
}

function updatePlayButton() {
  const isPlaying = !audio.paused && !audio.ended;
  playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
  playButton.setAttribute("aria-label", (isPlaying ? "Pause " : "Play ") + "Somewhere on the Way to the Lake");
  playButton.setAttribute("aria-pressed", String(isPlaying));
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      playButton.setAttribute("aria-label", "Playback could not start. Try again.");
    }
  } else {
    audio.pause();
  }
});

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", updatePlayButton);
audio.addEventListener("loadedmetadata", updatePlaybackDisplay);
audio.addEventListener("durationchange", updatePlaybackDisplay);
audio.addEventListener("timeupdate", updatePlaybackDisplay);

progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
    updatePlaybackDisplay();
  }
});

volumeControl.addEventListener("input", () => {
  audio.volume = Number(volumeControl.value);
});

audio.volume = Number(volumeControl.value);
updatePlaybackDisplay();
updatePlayButton();

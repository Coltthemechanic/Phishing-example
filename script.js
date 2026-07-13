// ======= PASTE YOUR YOUTUBE LINK (any format) or VIDEO ID here =======
const VIDEO_LINK = "https://www.youtube.com/watch?v=Aq5WXmQQooo";
// Accepts: watch URLs, youtu.be links, embed links, or a bare video ID
// ======================================================================

// Extract the 11-character video ID from whatever was pasted above
function getVideoId(link) {
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/
  ];
  for (const p of patterns) {
    const m = link.match(p);
    if (m) return m[1];
  }
  return link.trim(); // assume it's already a bare ID
}

const VIDEO_ID = getVideoId(VIDEO_LINK);

let player = null;
let playerReady = false;
let started = false;
let tappedEarly = false; // user tapped before the player finished loading

// Load the YouTube IFrame API
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// The YouTube API calls this automatically once loaded.
// Must live on window since this is an external script file.
window.onYouTubeIframeAPIReady = function () {
  player = new YT.Player("player", {
    videoId: VIDEO_ID,
    playerVars: {
      playsinline: 1,   // stay in-page on iPhones instead of native fullscreen
      controls: 1,      // set to 0 to hide the player controls
      rel: 0,
      modestbranding: 1
    },
    events: {
      onReady: function () {
        playerReady = true;
        // If they already tapped while we were still loading, start now
        if (tappedEarly && !started) {
          reveal();
        }
      }
    }
  });
};

// Single listener — 'click' fires for both mouse clicks and mobile taps
document.getElementById("tapzone").addEventListener("click", function () {
  if (started) return;

  if (!playerReady) {
    // Player not ready yet: remember the tap, start as soon as it is
    tappedEarly = true;
    return;
  }

  reveal();
});

function reveal() {
  started = true;
  document.getElementById("videowrap").classList.add("active");
  document.getElementById("tapzone").style.display = "none";

  player.unMute();
  player.setVolume(100);
  player.playVideo();
}

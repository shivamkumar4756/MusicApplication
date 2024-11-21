// Spotify Access Token (Fetch dynamically or replace with your method)
const accessToken = localStorage.getItem("spotifyAccessToken") || "BQA-sMDT1opb3YXpFcZgBBCZeHEUgGVQzZ3dqXuWOSbLeo-_yb_HHnUeJ-aK4Xf50-BBcyo4XDH_H5IFzOXco4OGiM6wrQ44FONmurg_1EqmwxA4qTA";

// Elements
const trackListElement = document.getElementById("track-list");
const audioPlayer = new Audio();
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const trackCover = document.getElementById("track-cover");
const playPauseButton = document.getElementById("play-pause-btn");

// Current Track State
let currentTrackIndex = 0;
let tracks = [];

// Load Playlist and Populate UI
async function loadPlaylist(playlistId) {
    tracks = await fetchAllPlaylistTracks(playlistId, accessToken);

    // Clear existing tracks
    trackListElement.innerHTML = "";

    // Populate the playlist UI
    tracks.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${item.track.album.images[0].url}" class="track-cover-small" alt="Cover">
            <span>${item.track.name} - ${item.track.artists[0].name}</span>
        `;
        li.onclick = () => playTrack(index); // Set track click listener
        trackListElement.appendChild(li);
    });

    // Play the first track by default
    if (tracks.length > 0) playTrack(0);
}

// Play Track by Index
function playTrack(index) {
    currentTrackIndex = index;
    const track = tracks[index].track;

    // Update Player UI
    trackTitle.textContent = track.name;
    trackArtist.textContent = track.artists[0].name;
    trackCover.src = track.album.images[0].url;
    audioPlayer.src = track.preview_url;

    // Play the track
    audioPlayer.play();
    playPauseButton.textContent = "Pause";
}

// Play/Pause Toggle
playPauseButton.onclick = () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseButton.textContent = "Pause";
    } else {
        audioPlayer.pause();
        playPauseButton.textContent = "Play";
    }
};

// Next and Previous Track Navigation
document.getElementById("next-btn").onclick = () => {
    if (currentTrackIndex < tracks.length - 1) playTrack(currentTrackIndex + 1);
};

document.getElementById("prev-btn").onclick = () => {
    if (currentTrackIndex > 0) playTrack(currentTrackIndex - 1);
};

// Volume Control
document.getElementById("volume-control").oninput = (event) => {
    audioPlayer.volume = event.target.value;
};

// Example: Load a Spotify Playlist (Replace with your playlist ID)
loadPlaylist("37i9dQZF1DXcBWIGoYBM5M");

// adding code for dark mode
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        body.classList.add("light-mode");
        themeToggle.textContent = "Switch to Dark Mode";
    }

    // Toggle theme on button click
    themeToggle.addEventListener("click", () => {
        body.classList.toggle("light-mode");

        // Update button text
        if (body.classList.contains("light-mode")) {
            themeToggle.textContent = "Switch to Dark Mode";
            localStorage.setItem("theme", "light");
        } else {
            themeToggle.textContent = "Switch to Light Mode";
            localStorage.setItem("theme", "dark");
        }
    });
});

const seekBar = document.getElementById("seek-bar");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");
// Update Progress
audioPlayer.addEventListener("timeupdate", () => {
    seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    durationEl.textContent = formatTime(audioPlayer.duration);
});

// Seek Track
seekBar.addEventListener("input", (e) => {
    audioPlayer.currentTime = (e.target.value / 100) * audioPlayer.duration;
});

// Format Time
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}
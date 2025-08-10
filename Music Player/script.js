// --- DOM Elements ---
const audioPlayer = document.getElementById('audio-player');
const songCover = document.getElementById('song-cover');
const songTitle = document.getElementById('song-title');
const songArtist = document.getElementById('song-artist');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const playlistList = document.getElementById('playlist-list');
const themeToggle = document.getElementById('theme-toggle');

// --- Playlist Data (Replace with your actual songs) ---
const playlist = [
    {
        title: 'Kabhi Kabhi Aditi',
        artist: 'Rashid Ali',
        cover: 'https://placehold.co/100x100/100/fff?text=Aditi',
        audio: 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
    },
    {
        title: 'Pehli Nazar Mein',
        artist: 'Atif Aslam',
        cover: 'https://placehold.co/100x100/226040/fff?text=Nazar',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
        title: 'Tum Hi Ho',
        artist: 'Arijit Singh',
        cover: 'https://placehold.co/100x100/901010/fff?text=Tum',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
        title: 'O Saathi',
        artist: 'Atif Aslam',
        cover: 'https://placehold.co/100x100/457010/fff?text=Saathi',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
    {
        title: 'Hawayein',
        artist: 'Arijit Singh',
        cover: 'https://placehold.co/100x100/601060/fff?text=Hawayein',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    },
    {
        title: 'Khairiyat',
        artist: 'Arijit Singh',
        cover: 'https://placehold.co/100x100/106060/fff?text=Khairiyat',
        audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    }
];

let currentSongIndex = 0;
let isPlaying = false;

// --- Functions ---

// Loads a song from the playlist
function loadSong(index) {
    const song = playlist[index];
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    songCover.src = song.cover;
    audioPlayer.src = song.audio;
    
    // Highlight the active song in the playlist
    updatePlaylistHighlight(index);
}

// Plays the current song
function playSong() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    audioPlayer.play();
}

// Pauses the current song
function pauseSong() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    audioPlayer.pause();
}

// Plays the next song in the playlist
function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
}

// Plays the previous song in the playlist
function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    playSong();
}

// Updates the progress bar and time display
function updateProgress() {
    const { duration, currentTime } = audioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // Update current time and duration display
    currentTimeEl.textContent = formatTime(currentTime);
    if (duration) {
        durationEl.textContent = formatTime(duration);
    }
}

// Allows user to seek through the song
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
}

// Updates volume
function setVolume() {
    audioPlayer.volume = volumeSlider.value;
}

// Formats time in minutes and seconds
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
    return `${minutes}:${formattedSeconds}`;
}

// Generates the playlist in the UI
function generatePlaylist() {
    playlistList.innerHTML = ''; // Clear existing playlist
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        li.setAttribute('data-index', index);
        
        li.innerHTML = `
            <img class="playlist-cover" src="${song.cover}" alt="${song.title}">
            <div class="playlist-text">
                <h4 class="playlist-song-title">${song.title}</h4>
                <p class="playlist-song-artist">${song.artist}</p>
            </div>
        `;

        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
        
        playlistList.appendChild(li);
    });
}

// Highlights the currently playing song in the playlist
function updatePlaylistHighlight(index) {
    document.querySelectorAll('.playlist-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeItem = document.querySelector(`.playlist-item[data-index="${index}"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// --- Theme Toggle Logic ---
function toggleTheme() {
    const body = document.body;
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

// Check for saved theme preference on initial load
function checkThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}


// --- Event Listeners ---

// Play/Pause button functionality
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// Previous button
prevBtn.addEventListener('click', prevSong);

// Next button
nextBtn.addEventListener('click', nextSong);

// Update progress bar as song plays
audioPlayer.addEventListener('timeupdate', updateProgress);

// Seek functionality for the progress bar
progressBar.addEventListener('click', setProgress);

// Autoplay the next song when the current one ends
audioPlayer.addEventListener('ended', nextSong);

// Update volume when the slider is changed
volumeSlider.addEventListener('input', setVolume);

// Theme toggle button
themeToggle.addEventListener('click', toggleTheme);


// Initial setup on page load
window.addEventListener('load', () => {
    checkThemePreference();
    generatePlaylist();
    loadSong(currentSongIndex);
});

<script>
  import { onMount } from 'svelte';
  import { FaMusic, FaVolumeUp, FaVolumeMute } from 'svelte-icons/fa';
  
  let audio;
  let playing = false;
  let volume = 0.5;
  let muted = false;
  
  onMount(() => {
    // Create audio element
    audio = new Audio('./music/tape.mp3');
    audio.loop = true;
    audio.volume = volume;
    
    // Check if music preference is stored in localStorage
    const storedPlaying = localStorage.getItem('musicPlaying');
    if (storedPlaying === 'true') {
      playAudio();
    }
    
    // Check if volume preference is stored in localStorage
    const storedVolume = localStorage.getItem('musicVolume');
    if (storedVolume !== null) {
      volume = parseFloat(storedVolume);
      if (audio) audio.volume = volume;
    }
    
    // Check if muted preference is stored in localStorage
    const storedMuted = localStorage.getItem('musicMuted');
    if (storedMuted !== null) {
      muted = storedMuted === 'true';
      if (audio) audio.muted = muted;
    }
    
    // Clean up on component destruction
    return () => {
      if (audio) {
        audio.pause();
        audio = null;
      }
    };
  });
  
  function togglePlay() {
    if (playing) {
      pauseAudio();
    } else {
      playAudio();
    }
  }
  
  function playAudio() {
    if (audio) {
      audio.play()
        .then(() => {
          playing = true;
          localStorage.setItem('musicPlaying', 'true');
        })
        .catch(error => {
          console.error('Error playing audio:', error);
        });
    }
  }
  
  function pauseAudio() {
    if (audio) {
      audio.pause();
      playing = false;
      localStorage.setItem('musicPlaying', 'false');
    }
  }
  
  function handleVolumeChange(event) {
    volume = event.target.value;
    if (audio) {
      audio.volume = volume;
    }
    localStorage.setItem('musicVolume', volume.toString());
  }
  
  function toggleMute() {
    muted = !muted;
    if (audio) {
      audio.muted = muted;
    }
    localStorage.setItem('musicMuted', muted.toString());
  }
</script>

<div class="audio-controls">
  <button class="music-toggle" on:click={togglePlay} aria-label="{playing ? 'Pause music' : 'Play music'}">
    <div class="icon-container {playing ? 'spin' : ''}">
      <FaMusic />
    </div>
  </button>
  
  <button class="volume-toggle" on:click={toggleMute} aria-label="{muted ? 'Unmute' : 'Mute'}">
    {#if muted}
      <FaVolumeMute />
    {:else}
      <FaVolumeUp />
    {/if}
  </button>
  
  <input 
    type="range" 
    min="0" 
    max="1" 
    step="0.01" 
    class="volume-slider" 
    value={volume} 
    on:input={handleVolumeChange} 
    aria-label="Volume control"
  />
</div>

<style>
  .audio-controls {
    position: fixed;
    bottom: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1000;
    background: var(--card-bg);
    padding: 10px;
    border-radius: 20px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
    border: 1px solid var(--border-color);
  }
  
  .audio-controls:hover {
    opacity: 1;
  }
  
  .music-toggle, .volume-toggle {
    background-color: var(--button-bg);
    border: 1px solid var(--border-color);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.3s ease, background-color 0.3s;
    color: var(--accent-color);
  }
  
  .music-toggle:hover, .volume-toggle:hover {
    transform: scale(1.1);
    background-color: var(--button-hover-bg);
  }
  
  .icon-container {
    width: 20px;
    height: 20px;
  }
  
  .spin {
    animation: spin 8s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .volume-slider {
    width: 100px;
    height: 4px;
    -webkit-appearance: none;
    background: var(--border-color);
    border-radius: 2px;
    outline: none;
  }
  
  .volume-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--accent-color);
    cursor: pointer;
  }
  
  .volume-slider::-moz-range-thumb {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: var(--accent-color);
    cursor: pointer;
    border: none;
  }
  
  @media (max-width: 600px) {
    .audio-controls {
      bottom: 10px;
      left: 10px;
      padding: 8px;
    }
    
    .music-toggle, .volume-toggle {
      width: 30px;
      height: 30px;
    }
    
    .volume-slider {
      width: 60px;
    }
  }
</style>
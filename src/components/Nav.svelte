<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  
  // Props
  export let darkMode = true;
  export let toggleDarkMode;
  
  // Use window.location to get the current path
  let path = '';
  
  onMount(() => {
    // Set initial path - for hash routing, we need to get the hash part
    updatePath();
    
    // Update path when navigation occurs
    const handleNavigation = () => {
      updatePath();
    };
    
    // Function to extract path from hash
    function updatePath() {
      // For hash routing, the format is #/path
      const hash = window.location.hash;
      path = hash ? hash.substring(1) : '/';
    }
    
    // Listen for navigation events
    window.addEventListener('hashchange', handleNavigation);
    
    return () => {
      window.removeEventListener('hashchange', handleNavigation);
    };
  });
</script>

<nav class="nav">
  <div class="logo">
    <Link to="/">when trees fall...</Link>
  </div>
  
  <div class="nav-links">
    <Link to="/" class="nav-link {path === '/' ? 'active' : ''}" on:click={() => path = '/'}>Home</Link>
    <Link to="/blog" class="nav-link {path.startsWith('/blog') ? 'active' : ''}" on:click={() => path = '/blog'}>Blog</Link>
    <Link to="/about" class="nav-link {path === '/about' ? 'active' : ''}" on:click={() => path = '/about'}>About</Link>
    <button class="theme-toggle" on:click={toggleDarkMode} aria-label="Toggle theme">
      {#if darkMode}
        ☀️
      {:else}
        🌙
      {/if}
    </button>
  </div>
</nav>

<style>
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border-color);
    backdrop-filter: blur(5px);
    position: sticky;
    top: 0;
    z-index: 100;
    transition: padding 0.3s, box-shadow 0.3s;
  }
  
  .logo a {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color);
    text-decoration: none;
    font-family: 'Bitcount Prop Double', monospace;
    transition: transform 0.3s;
  }
  
  .logo a:hover {
    transform: scale(1.05);
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  
  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s, transform 0.3s;
    font-size: 1rem;
    position: relative;
    padding: 5px 0;
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: var(--accent-color);
    transition: width 0.3s;
  }
  
  .nav-link:hover, .nav-link.active {
    color: var(--accent-color);
    transform: translateY(-2px);
  }
  
  .nav-link:hover::after, .nav-link.active::after {
    width: 100%;
  }
  
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border-radius: 50%;
    transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  .theme-toggle:hover {
    background-color: var(--button-bg);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 600px) {
    .nav {
      flex-direction: column;
      gap: 15px;
    }
    
    .nav-links {
      width: 100%;
      justify-content: space-between;
    }
  }
</style>
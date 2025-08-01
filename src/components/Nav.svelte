<script>
  import { Link } from 'svelte-routing';
  import { onMount } from 'svelte';
  
  // Props
  export let darkMode = true;
  export let toggleDarkMode;
  
  // Use window.location to get the current path
  let path = '';
  
  onMount(() => {
    // Set initial path
    path = window.location.pathname;
    
    // Update path when navigation occurs
    const handleNavigation = () => {
      path = window.location.pathname;
    };
    
    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
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
  }
  
  .logo a {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--accent-color);
    text-decoration: none;
  }
  
  .nav-links {
    display: flex;
    gap: 20px;
    align-items: center;
  }
  
  .nav-link {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s;
    font-size: 1rem;
  }
  
  .nav-link:hover, .nav-link.active {
    color: var(--accent-color);
  }
  
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }
  
  .theme-toggle:hover {
    background-color: var(--button-bg);
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
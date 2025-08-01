<script>
  import { onMount } from 'svelte';
  import { Router, Route } from 'svelte-routing';
  import Home from './routes/Home.svelte';
  import Blog from './routes/Blog.svelte';
  import BlogPost from './routes/BlogPost.svelte';
  import About from './routes/About.svelte';
  import Nav from './components/Nav.svelte';
  import Footer from './components/Footer.svelte';
  import AudioPlayer from './components/AudioPlayer.svelte';
  
  // Get the base URL for routing
  let basePath = '';
  
  // Export the url prop for the Router
  export let url = '';
  
  // Dark mode state
  let darkMode = true; // Default to dark mode for the black and red theme
  
  onMount(() => {
    // Check if dark mode preference is stored in localStorage
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      darkMode = storedDarkMode === 'true';
    }
    
    // Apply dark mode class
    updateDarkMode();
    
    // Get the base path from window if available
    if (typeof window !== 'undefined' && window.basePath !== undefined) {
      basePath = window.basePath;
    }
  });
  
  // Toggle dark mode
  function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode.toString());
    updateDarkMode();
  }
  
  // Update dark mode class on body
  function updateDarkMode() {
    if (darkMode) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
</script>

<Router {url} basepath={basePath} mode="hash">
  <div class="app-container">
    <Nav {darkMode} {toggleDarkMode} />
    
    <main>
      <Route path="/" component={Home} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/about" component={About} />
    </main>
    
    <Footer />
    
    <AudioPlayer />
  </div>
</Router>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding: 20px;
  }
</style>
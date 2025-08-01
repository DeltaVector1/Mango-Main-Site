<script>
  import { onMount } from 'svelte';
  import { getAboutPage } from '../lib/blog';
  
  let aboutContent = null;
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      aboutContent = getAboutPage();
      
      if (!aboutContent) {
        error = 'About page content not found.';
      }
      
      loading = false;
    } catch (err) {
      console.error('Error loading about page:', err);
      error = 'Failed to load about page. Please try again later.';
      loading = false;
    }
  });
</script>

<div class="about-container">
  {#if loading}
    <div class="loading">Loading about page...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else}
    <div class="about-header">
      <h1>{aboutContent.frontmatter.title}</h1>
    </div>
    
    <div class="about-content markdown-content">
      {@html aboutContent.content}
    </div>
  {/if}
</div>

<style>
  .about-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .loading, .error {
    text-align: center;
    padding: 40px 0;
    font-size: 1.2rem;
  }
  
  .error {
    color: var(--accent-color);
  }
  
  .about-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .about-header h1 {
    font-size: 3rem;
    color: var(--accent-color);
  }
  
  .about-content {
    line-height: 1.8;
  }
  
  @media (max-width: 768px) {
    .about-header h1 {
      font-size: 2.5rem;
    }
  }
</style>
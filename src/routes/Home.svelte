<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { getAllPosts } from '../lib/blog';
  import { formatDate } from '../lib/markdown';
  
  let posts = [];
  let loading = true;
  let error = null;
  
  onMount(async () => {
    try {
      posts = getAllPosts().slice(0, 3); // Get the 3 most recent posts
      loading = false;
    } catch (err) {
      console.error('Error loading posts:', err);
      error = 'Failed to load blog posts. Please try again later.';
      loading = false;
    }
  });
</script>

<div class="home-container">
  <div class="hero">
    <h1 class="title">when trees fall...</h1>
    <p class="subtitle">Thoughts on AI, machine learning, and more</p>
    
    <div class="mascot-container">
      <img src="./images/mascot.png" alt="Site mascot" class="mascot-image" />
      <div class="dialogue-box">
        Welcome to my digital garden!
      </div>
    </div>
  </div>
  
  <div class="recent-posts">
    <h2>Recent Posts</h2>
    
    {#if loading}
      <p>Loading posts...</p>
    {:else if error}
      <p class="error">{error}</p>
    {:else if posts.length === 0}
      <p>No posts found. Check back soon!</p>
    {:else}
      <div class="blog-list">
        {#each posts as post}
          <Link to={`/blog/${post.slug}`} class="blog-card-link">
            <div class="blog-card">
              <h3 class="blog-title">{post.frontmatter.title}</h3>
              <p class="blog-date">{formatDate(post.frontmatter.date)}</p>
              <p class="blog-excerpt">{post.frontmatter.excerpt}</p>
            </div>
          </Link>
        {/each}
      </div>
      
      <div class="view-all">
        <Link to="/blog" class="view-all-link">View all posts →</Link>
      </div>
    {/if}
  </div>
</div>

<style>
  .home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .hero {
    text-align: center;
    margin-bottom: 60px;
    padding: 40px 0;
  }
  
  .title {
    font-size: 3.5rem;
    color: var(--accent-color);
    margin-bottom: 10px;
  }
  
  .subtitle {
    font-size: 1.2rem;
    color: var(--text-color);
    opacity: 0.9;
  }
  
  .mascot-container {
    position: relative;
    width: 200px;
    margin: 40px auto;
    cursor: pointer;
    transition: transform 0.3s ease;
  }
  
  .mascot-container:hover {
    transform: scale(1.05);
  }
  
  .mascot-image {
    width: 150px;
    height: auto;
    display: block;
    margin: 0 auto;
  }
  
  .dialogue-box {
    position: absolute;
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 15px;
    padding: 10px 15px;
    top: -60px;
    right: -20px;
    font-size: 0.9em;
    white-space: nowrap;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
  }
  
  .dialogue-box::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid var(--border-color);
  }
  
  .recent-posts {
    margin-top: 40px;
  }
  
  .recent-posts h2 {
    font-size: 2rem;
    color: var(--accent-color);
    margin-bottom: 30px;
    text-align: center;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 10px;
  }
  
  .blog-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .view-all {
    text-align: center;
    margin-top: 40px;
  }
  
  .view-all-link {
    display: inline-block;
    padding: 10px 20px;
    background-color: var(--button-bg);
    color: var(--button-text);
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    border: 1px solid var(--border-color);
  }
  
  .view-all-link:hover {
    background-color: var(--button-hover-bg);
  }
  
  .error {
    color: var(--accent-color);
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .title {
      font-size: 2.5rem;
    }
    
    .subtitle {
      font-size: 1rem;
    }
    
    .mascot-image {
      width: 120px;
    }
  }
</style>
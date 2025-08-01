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
      posts = await getAllPosts();
      loading = false;
    } catch (err) {
      console.error('Error loading posts:', err);
      error = 'Failed to load blog posts. Please try again later.';
      loading = false;
    }
  });
</script>

<div class="blog-container">
  <div class="blog-header">
    <h1>Blog</h1>
    <p>Thoughts, ideas, and explorations</p>
  </div>
  
  {#if loading}
    <div class="loading">Loading posts...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if posts.length === 0}
    <div class="empty-state">
      <p>No blog posts found.</p>
      <p>Check back soon for new content!</p>
    </div>
  {:else}
    <div class="blog-list">
      {#each posts as post}
        <Link to={`/blog/${post.slug}`} class="blog-card-link">
          <div class="blog-card">
            <h2 class="blog-title">{post.frontmatter.title}</h2>
            <p class="blog-date">{formatDate(post.frontmatter.date)}</p>
            <p class="blog-excerpt">{post.frontmatter.excerpt}</p>
          </div>
        </Link>
      {/each}
    </div>
  {/if}
</div>

<style>
  .blog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .blog-header {
    text-align: center;
    margin-bottom: 40px;
  }
  
  .blog-header h1 {
    font-size: 3rem;
    color: var(--accent-color);
    margin-bottom: 10px;
  }
  
  .blog-header p {
    font-size: 1.2rem;
    color: var(--text-color);
    opacity: 0.9;
  }
  
  .blog-card-link {
    text-decoration: none;
    color: inherit;
    display: block;
  }
  
  .loading, .error, .empty-state {
    text-align: center;
    padding: 40px 0;
    font-size: 1.2rem;
  }
  
  .error {
    color: var(--accent-color);
  }
  
  .empty-state {
    color: var(--text-color);
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    .blog-header h1 {
      font-size: 2.5rem;
    }
    
    .blog-header p {
      font-size: 1rem;
    }
  }
</style>
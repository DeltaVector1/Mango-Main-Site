<script>
  import { onMount } from 'svelte';
  import { Link } from 'svelte-routing';
  import { getPostBySlug, getAllPosts } from '../lib/blog';
  import { formatDate } from '../lib/markdown';
  
  // Export the slug prop from the router
  export let slug;
  
  let post = null;
  let loading = true;
  let error = null;
  let relatedPosts = [];
  
  onMount(async () => {
    try {
      // Get the post by slug
      post = getPostBySlug(slug);
      
      if (!post) {
        error = 'Blog post not found.';
        loading = false;
        return;
      }
      
      // Get related posts (excluding the current post)
      const allPosts = getAllPosts();
      relatedPosts = allPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3); // Get up to 3 related posts
      
      loading = false;
    } catch (err) {
      console.error('Error loading post:', err);
      error = 'Failed to load blog post. Please try again later.';
      loading = false;
    }
  });
</script>

<div class="blog-post-container">
  {#if loading}
    <div class="loading">Loading post...</div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <Link to="/blog" class="back-link">← Back to all posts</Link>
    </div>
  {:else}
    <article class="blog-post">
      <header class="post-header">
        <h1>{post.frontmatter.title}</h1>
        <p class="post-date">{formatDate(post.frontmatter.date)}</p>
      </header>
      
      <div class="post-content markdown-content">
        {@html post.content}
      </div>
      
      <footer class="post-footer">
        <Link to="/blog" class="back-link">← Back to all posts</Link>
      </footer>
    </article>
    
    {#if relatedPosts.length > 0}
      <div class="related-posts">
        <h2>Related Posts</h2>
        <div class="blog-list">
          {#each relatedPosts as relatedPost}
            <Link to={`/blog/${relatedPost.slug}`} class="blog-card-link">
              <div class="blog-card">
                <h3 class="blog-title">{relatedPost.frontmatter.title}</h3>
                <p class="blog-date">{formatDate(relatedPost.frontmatter.date)}</p>
                <p class="blog-excerpt">{relatedPost.frontmatter.excerpt}</p>
              </div>
            </Link>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .blog-post-container {
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
  
  .post-header {
    margin-bottom: 30px;
    text-align: center;
  }
  
  .post-header h1 {
    font-size: 2.5rem;
    color: var(--accent-color);
    margin-bottom: 10px;
  }
  
  .post-date {
    font-size: 1rem;
    color: var(--blog-date-color);
  }
  
  .post-content {
    line-height: 1.8;
    margin-bottom: 40px;
  }
  
  .post-footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
  }
  
  .back-link {
    display: inline-block;
    color: var(--accent-color);
    text-decoration: none;
    transition: color 0.3s;
  }
  
  .back-link:hover {
    color: var(--link-hover-color);
  }
  
  .related-posts {
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid var(--border-color);
  }
  
  .related-posts h2 {
    font-size: 1.8rem;
    color: var(--accent-color);
    margin-bottom: 20px;
    text-align: center;
  }
  
  @media (max-width: 768px) {
    .post-header h1 {
      font-size: 2rem;
    }
  }
</style>
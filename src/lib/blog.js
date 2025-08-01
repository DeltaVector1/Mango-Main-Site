import { parseMarkdown, sortPostsByDate } from './markdown';

// Get the base URL for the current environment
function getBaseUrl() {
  // Check if we're running in a browser environment
  if (typeof window !== 'undefined') {
    // For GitHub Pages, the base URL might be the repository name
    // Extract the base path from the current URL
    const pathSegments = window.location.pathname.split('/');
    // If we're on GitHub Pages with a custom domain, use root path
    if (window.location.hostname === 'mango.anthra.site') {
      return '';
    }
    // If we're on github.io domain, the first segment after the domain would be the repo name
    else if (window.location.hostname.includes('github.io')) {
      return pathSegments[1] ? `/${pathSegments[1]}` : '';
    }
    // For local development or other environments, use root path
    return '';
  }
  // Fallback to root path if not in browser
  return '';
}

// Use relative path instead of absolute path for blog directory
const BLOG_DIR = `${getBaseUrl()}blogs`;

/**
 * Get all blog posts
 * @returns {Promise<Array>} - Promise resolving to array of blog posts with frontmatter and content
 */
export async function getAllPosts() {
  // Known blog posts - in a real app, you might fetch a list from an API
  const knownPosts = [
    'first-blog-post',
    'learning-to-dequantise',
    'the-new-xor-problem'
  ];
  
  // Fetch each post in parallel
  const postsPromises = knownPosts.map(async (slug) => {
    try {
      const post = await getPostBySlug(slug);
      return post;
    } catch (error) {
      console.error(`Error loading post ${slug}:`, error);
      return null;
    }
  });
  
  // Wait for all posts to be fetched
  const posts = await Promise.all(postsPromises);
  
  // Filter out any failed posts and sort by date
  return sortPostsByDate(posts.filter(Boolean));
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<Object|null>} - Promise resolving to the blog post or null if not found
 */
export async function getPostBySlug(slug) {
  try {
    // Fetch the markdown file
    const response = await fetch(`${BLOG_DIR}/${slug}.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }
    
    // Get the file contents
    const fileContents = await response.text();
    
    // Parse the markdown
    const { frontmatter, content } = parseMarkdown(fileContents);
    
    // Skip about page or other special pages
    if (frontmatter.type === 'about') return null;
    
    // Return the post data
    return {
      slug,
      frontmatter,
      content
    };
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

/**
 * Get the about page content
 * @returns {Promise<Object|null>} - Promise resolving to the about page content or null if not found
 */
export async function getAboutPage() {
  try {
    // Fetch the about markdown file
    const response = await fetch(`${BLOG_DIR}/about.md`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch about page: ${response.status}`);
    }
    
    // Get the file contents
    const fileContents = await response.text();
    
    // Parse the markdown
    const { frontmatter, content } = parseMarkdown(fileContents);
    
    return {
      frontmatter,
      content
    };
  } catch (error) {
    console.error('Error fetching about page:', error);
    return null;
  }
}
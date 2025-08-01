import { parseMarkdown, sortPostsByDate } from './markdown';

const BLOG_DIR = '/blogs';

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
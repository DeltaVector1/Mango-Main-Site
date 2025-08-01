import { marked } from 'marked';
import matter from 'gray-matter';

/**
 * Parse a markdown file with frontmatter
 * @param {string} markdown - The markdown content
 * @returns {Object} - The parsed markdown with frontmatter and HTML content
 */
export function parseMarkdown(markdown) {
  // Parse frontmatter
  const { data, content } = matter(markdown);
  
  // Convert markdown to HTML
  const html = marked(content);
  
  return {
    frontmatter: data,
    content: html
  };
}

/**
 * Sort blog posts by date (newest first)
 * @param {Array} posts - Array of blog posts with frontmatter
 * @returns {Array} - Sorted array of blog posts
 */
export function sortPostsByDate(posts) {
  return posts.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date);
    const dateB = new Date(b.frontmatter.date);
    return dateB - dateA;
  });
}

/**
 * Format a date string
 * @param {string} dateString - The date string to format
 * @returns {string} - The formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Create an excerpt from markdown content
 * @param {string} content - The markdown content
 * @param {number} length - The maximum length of the excerpt
 * @returns {string} - The excerpt
 */
export function createExcerpt(content, length = 150) {
  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Truncate to length
  if (text.length <= length) return text;
  
  // Find the last space before the length limit
  const lastSpace = text.lastIndexOf(' ', length);
  return text.substring(0, lastSpace) + '...';
}
import fs from 'fs';
import path from 'path';
import { parseMarkdown, sortPostsByDate } from './markdown';

const BLOG_DIR = path.join(process.cwd(), 'blogs');

/**
 * Get all blog posts
 * @returns {Array} - Array of blog posts with frontmatter and content
 */
export function getAllPosts() {
  // Get all markdown files from the blogs directory
  const files = fs.readdirSync(BLOG_DIR);
  const markdownFiles = files.filter(file => file.endsWith('.md'));
  
  // Parse each markdown file
  const posts = markdownFiles.map(filename => {
    const filePath = path.join(BLOG_DIR, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, content } = parseMarkdown(fileContents);
    
    // Skip about page or other special pages
    if (frontmatter.type === 'about') return null;
    
    // Add slug based on filename
    const slug = filename.replace(/\.md$/, '');
    
    return {
      slug,
      frontmatter,
      content
    };
  }).filter(Boolean); // Remove null entries
  
  // Sort posts by date
  return sortPostsByDate(posts);
}

/**
 * Get a single blog post by slug
 * @param {string} slug - The post slug
 * @returns {Object|null} - The blog post or null if not found
 */
export function getPostBySlug(slug) {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) return null;
  
  // Read and parse the file
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, content } = parseMarkdown(fileContents);
  
  return {
    slug,
    frontmatter,
    content
  };
}

/**
 * Get the about page content
 * @returns {Object|null} - The about page content or null if not found
 */
export function getAboutPage() {
  const filePath = path.join(BLOG_DIR, 'about.md');
  
  // Check if file exists
  if (!fs.existsSync(filePath)) return null;
  
  // Read and parse the file
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { frontmatter, content } = parseMarkdown(fileContents);
  
  return {
    frontmatter,
    content
  };
}
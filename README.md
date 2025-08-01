# When Trees Fall... Blog

A minimalist blog site with a pitch black and red theme. This site allows for easy blog post creation by simply adding markdown files to the `blogs` directory.

## Features

- Minimalist design with a pitch black and red theme
- Markdown-based blog system
- Easy blog post creation - just add markdown files to the `blogs` directory
- Responsive design that works on mobile and desktop
- About page
- Background music player

## Blog Post Format

Blog posts are written in Markdown format with frontmatter. Here's an example:

```markdown
---
title: My Blog Post Title
date: 2023-08-10
excerpt: A brief summary of the blog post that will appear in the list view.
---

# My Blog Post Title

This is the content of my blog post. You can use all standard Markdown features:

## Subheadings

- Lists
- Of items

### Code blocks

```js
console.log('Hello, world!');
```

And more...
```

## Project Structure

```
├── blogs/                # Blog post markdown files
├── build/                # Compiled files
├── images/               # Image assets
├── music/                # Audio files
├── src/                  # Source code
│   ├── components/       # Reusable components
│   ├── lib/              # Utility functions
│   ├── routes/           # Page components
│   ├── App.svelte        # Main app component
│   └── main.js           # Entry point
├── global.css            # Global styles
├── index.html            # HTML entry point
├── package.json          # Dependencies
└── rollup.config.js      # Build configuration
```

## Development

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

## Adding a New Blog Post

1. Create a new markdown file in the `blogs` directory
2. Add frontmatter with `title`, `date`, and `excerpt`
3. Write your blog post content in Markdown
4. The post will automatically appear in the blog list

## License

MIT
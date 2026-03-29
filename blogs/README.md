# Blog Management Guide

Your blog is powered by markdown files! No admin panel needed - just add `.md` files to the `/public/blogs/` folder.

## How to Add a New Blog Post

### Step 1: Create a Markdown File

Create a new `.md` file in `/app/frontend/public/blogs/` with your content.

**Example:** `my-new-post.md`

```markdown
---
title: Your Blog Title Here
date: January 20, 2025
author: Guru Prasanth E
excerpt: A brief summary of your blog post that appears in the blog listing page.
image: https://images.unsplash.com/photo-xxxxx?w=800
---

# Your Blog Title Here

Your blog content starts here...

## Section Heading

More content with **bold text** and *italic text*.

### Subsection

- Bullet point 1
- Bullet point 2

```code
Code blocks are supported too!
```

1. Numbered lists
2. Also work great

> Blockquotes for important callouts

[Links work too](https://example.com)
```

### Step 2: Update the Manifest

Add an entry to `/app/frontend/public/blogs/manifest.json`:

```json
[
  {
    "id": "my-new-post",
    "filename": "my-new-post.md",
    "title": "Your Blog Title Here",
    "date": "January 20, 2025",
    "author": "Guru Prasanth E",
    "excerpt": "A brief summary of your blog post...",
    "image": "https://images.unsplash.com/photo-xxxxx?w=800"
  },
  ... other blog posts ...
]
```

**Important:** 
- The `id` should match your filename (without `.md`)
- Add your new post at the **top** of the array to show it first
- The `image` URL will be displayed as the featured image

### Step 3: That's It!

Your new blog post will automatically appear on your blog page. No build or deployment needed!

## Markdown Features Supported

- **Headings:** `#`, `##`, `###`
- **Bold:** `**text**`
- **Italic:** `*text*`
- **Links:** `[text](url)`
- **Images:** `![alt](url)`
- **Code blocks:** Triple backticks
- **Lists:** Bullet (`-`) and numbered (`1.`)
- **Blockquotes:** `>`
- **Tables:** GitHub-flavored markdown tables
- **Strikethrough:** `~~text~~`
- **Task lists:** `- [ ]` and `- [x]`

## Finding Featured Images

Good sources for featured images:
- **Unsplash:** https://unsplash.com (free, high-quality)
- **Pexels:** https://pexels.com (free stock photos)
- **Pixabay:** https://pixabay.com (free images)

**Recommended size:** 1200x630px or higher for best quality

## File Structure

```
/app/frontend/public/blogs/
├── manifest.json                    # Blog metadata
├── kubernetes-security-2025.md      # Blog post
├── kafka-eks-migration.md           # Blog post
├── terraform-best-practices.md      # Blog post
└── sre-principles.md                # Blog post
```

## Tips

1. **Use descriptive filenames:** `kafka-migration.md` not `post1.md`
2. **Keep frontmatter consistent:** Always include all fields
3. **Test locally:** Visit http://localhost:3000/blog to see your changes
4. **Backup your posts:** Keep copies of your markdown files

Happy blogging! 🎉

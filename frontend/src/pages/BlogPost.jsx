import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPost = () => {
  const { theme, toggleTheme } = useTheme();
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog manifest to get metadata - use PUBLIC_URL for GitHub Pages compatibility
    const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
    fetch(`${basePath}/blogs/manifest.json`)
      .then(res => res.json())
      .then(data => {
        const foundBlog = data.find(b => b.id === id);
        if (foundBlog) {
          setBlog(foundBlog);
          // Fetch the markdown file
          return fetch(`${basePath}/blogs/${foundBlog.filename}`);
        }
        throw new Error('Blog not found');
      })
      .then(res => res.text())
      .then(text => {
        // Remove frontmatter from markdown
        const content = text.replace(/^---[\s\S]*?---/, '').trim();
        setMarkdown(content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading blog:', error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-primary focus:text-primary focus:outline-none transition-colors">
              Guru Prasanth
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/blog">
                <Button 
                  variant="outline" 
                  className="bg-transparent border-border text-foreground hover:bg-secondary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-transparent border-border text-foreground hover:bg-secondary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Blog Post Content */}
      <article className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Featured Image */}
          {blog.image && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={blog.image} 
                alt={blog.title}
                className="w-full h-96 object-cover"
              />
            </div>
          )}
          
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">{blog.title}</h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{blog.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{blog.author}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <div className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:text-foreground
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border
                prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                prose-li:text-muted-foreground
                prose-img:rounded-lg prose-img:shadow-lg
              ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Guru Prasanth E. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPost;
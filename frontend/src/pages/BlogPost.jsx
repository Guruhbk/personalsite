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
    // Fetch blog manifest to get metadata - use PUBLIC_URL only when it's set (production)
    const basePath = process.env.PUBLIC_URL || '';
    console.log('!!!!!!!!!!!!!! ',basePath)
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
            <Link to="/" className="text-xl font-bold hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">
              Guru Prasanth E
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all h-9 px-4 py-2 bg-transparent border border-border text-foreground hover:bg-secondary hover:text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:text-primary focus-visible:border-primary [&:focus-visible_svg]:text-primary [&:hover_svg]:text-primary shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="bg-transparent border-border text-foreground hover:bg-secondary hover:text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary transition-all [&:focus-visible]:!text-primary [&:focus-visible_svg]:!text-primary [&:hover_svg]:text-primary"
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
                prose-headings:font-bold prose-headings:text-foreground prose-headings:mt-8 prose-headings:mb-4
                prose-h1:text-4xl prose-h1:mt-0
                prose-h2:text-3xl prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                prose-h3:text-2xl
                prose-h4:text-xl
                prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-4
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                prose-pre>code:bg-transparent prose-pre>code:p-0 prose-pre>code:text-sm prose-pre>code:text-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-l-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground prose-blockquote:my-6
                prose-ul:text-muted-foreground prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                prose-ol:text-muted-foreground prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                prose-li:text-muted-foreground prose-li:my-2 prose-li:leading-relaxed
                prose-hr:border-border prose-hr:my-8
                prose-table:text-foreground prose-table:border-collapse
                prose-th:border prose-th:border-border prose-th:bg-secondary prose-th:p-2
                prose-td:border prose-td:border-border prose-td:p-2
                prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6
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

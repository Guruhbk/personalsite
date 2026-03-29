import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Moon, Sun } from 'lucide-react';
import { mockData } from '../utils/mock';
import { useTheme } from '../context/ThemeContext';

const Blog = () => {
  const { theme, toggleTheme } = useTheme();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(mockData.blogs);
  }, []);

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
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="border-border hover:bg-secondary hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="border-border hover:bg-secondary hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Blog Listing */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-12">Insights on DevOps, SRE, and Cloud Infrastructure</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden bg-card border-border hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary transition-all group">
                {/* Featured Image */}
                {blog.imageUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={blog.imageUrl} 
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{blog.title}</h2>
                  <p className="text-muted-foreground leading-relaxed">{blog.excerpt}</p>
                  <Link to={`/blog/${blog.id}`}>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all">
                      Read Article
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

export default Blog;

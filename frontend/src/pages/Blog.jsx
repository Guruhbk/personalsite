import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Moon, Sun, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Blog = () => {
  const { theme, toggleTheme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch blog manifest - use PUBLIC_URL for GitHub Pages compatibility
    const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
    fetch(`${basePath}/blogs/manifest.json`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setFilteredBlogs(data);
        const uniqueCategories = ['All', ...new Set(data.map(blog => blog.category))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading blogs:', error);
        setLoading(false);
      });
  }, []);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog => blog.category === category));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
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

      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-muted-foreground mb-8">Insights on DevOps, SRE, and Cloud Infrastructure</p>
          
          <div className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-border">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-secondary text-foreground hover:bg-secondary/80 hover:border-primary border border-border'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No posts found in this category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredBlogs.map((blog) => (
                <Link 
                  key={blog.id} 
                  to={`/blog/${blog.id}`}
                  className="block focus:outline-none"
                >
                  <Card className="overflow-hidden bg-card border-border hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary transition-all group h-full cursor-pointer">
                    {blog.image && (
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={blog.image} 
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="p-8 space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          <Tag className="w-3 h-3" />
                          {blog.category}
                        </span>
                      </div>

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
                      
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {blog.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-md group-hover:bg-primary/90 transition-colors font-medium">
                        Read Article
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

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

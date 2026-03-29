import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Download, Linkedin, Instagram, Calendar, MapPin, Briefcase, Moon, Sun } from 'lucide-react';
import { mockData } from '../utils/mock';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Load mock blogs
    setBlogs(mockData.blogs);
  }, []);

  const handleDownloadResume = () => {
    toast({
      title: "Download started",
      description: "Your resume is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#home" className="text-xl font-bold hover:text-primary focus:text-primary focus:outline-none transition-colors">
              Guru Prasanth
            </a>
            <div className="flex items-center gap-6">
              <Link 
                to="/blog" 
                className="text-base font-semibold text-foreground hover:text-primary focus:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-md px-3 py-2 transition-all"
              >
                Blog
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

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <img 
                src="https://customer-assets.emergentagent.com/job_resume-blog-hub-1/artifacts/8hwu5ly7_1760760158453%20%281%29.png"
                alt="Guru Prasanth E"
                className="w-64 h-64 rounded-2xl object-cover shadow-2xl border-4 border-primary/20"
              />
            </div>
            
            {/* Hero Content */}
            <div className="space-y-6 flex-1">
              <div className="inline-block px-4 py-2 bg-secondary border border-border rounded-full text-sm text-muted-foreground">
                Lead Engineer - Site Reliability
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Guru Prasanth E
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                A versatile IT professional with 9 years of experience spanning backend development and DevOps/Site Reliability Engineering. Currently leading site reliability initiatives at Freshworks, driving innovation and operational excellence.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={handleDownloadResume}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://www.linkedin.com/in/guru-prasanth-2003" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary border border-border rounded-lg hover:border-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary border border-border rounded-lg hover:border-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background focus:outline-none transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">Technical Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.skills.map((category, idx) => (
              <Card key={idx} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-secondary text-sm text-muted-foreground rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">Work Experience</h2>
          <div className="space-y-6">
            {mockData.experience.map((job, idx) => (
              <Card key={idx} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{job.role}</h3>
                    <p className="text-lg text-muted-foreground">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{job.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">Latest Blog Posts</h2>
              <p className="text-muted-foreground">Recent insights on DevOps, SRE, and Cloud Infrastructure</p>
            </div>
            <Link to="/blog">
              <Button 
                variant="outline" 
                className="border-border hover:bg-secondary hover:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all"
              >
                View All Posts
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
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
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                  <p className="text-muted-foreground line-clamp-3 text-sm">{blog.excerpt}</p>
                  <Link 
                    to={`/blog/${blog.id}`} 
                    className="inline-flex items-center text-primary hover:text-primary/80 focus:text-primary focus:outline-none focus:underline transition-colors text-sm font-medium"
                  >
                    Read More →
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Guru Prasanth E. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/guru-prasanth-2003" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

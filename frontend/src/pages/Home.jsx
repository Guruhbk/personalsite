import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { toast } from '../hooks/use-toast';
import { Download, Linkedin, Instagram, Github, Calendar, MapPin, Briefcase, Moon, Sun } from 'lucide-react';
import { mockData } from '../utils/mock';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const { theme, toggleTheme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // Load blogs from manifest - use PUBLIC_URL for GitHub Pages compatibility
    const basePath = process.env.NODE_ENV === 'development' ? '' : process.env.PUBLIC_URL || '';
    fetch(`${basePath}/blogs/manifest.json`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
      })
      .catch(error => {
        console.error('Error loading blogs:', error);
      });
  }, []);

  const handleDownloadResume = () => {
    // Download the actual PDF resume
    const link = document.createElement('a');
    link.href = 'https://customer-assets.emergentagent.com/job_d11f29f7-389a-47d6-bbab-d1e25765930e/artifacts/l5eabg87_Guru_Prasanth_E_Resume-2-1.pdf';
    link.download = 'Guru_Prasanth_E_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
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
            <a href="#home" className="text-xl font-bold hover:text-primary focus-visible:text-primary focus-visible:outline-none transition-colors">
              Guru Prasanth
            </a>
            <div className="flex items-center gap-6">
              <a 
                href="#home" 
                className={`text-base font-semibold hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-3 py-2 transition-all ${
                  activeSection === 'about' ? 'text-primary underline underline-offset-4 decoration-2' : 'text-foreground'
                }`}
              >
                About Guru
              </a>
              <Link 
                to="/blog" 
                className="text-base font-semibold text-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-3 py-2 transition-all"
              >
                Blog
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="border-border text-foreground hover:bg-secondary hover:text-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary transition-all [&:focus-visible]:!text-primary [&:focus-visible_svg]:!text-primary"
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
                Seasoned IT professional with 10+ years of experience across backend engineering and Site Reliability, specializing in building scalable, resilient, and high-performing distributed systems. Proven leader driving reliability, operational excellence, and large-scale infrastructure initiatives with a strong focus on architecture and system design.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button 
                  onClick={handleDownloadResume}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:brightness-110 transition-all"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
              <div className="flex gap-4 pt-2">
                <a 
                  href="https://www.linkedin.com/in/guru-prasanth-2003/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary border border-border rounded-lg hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary focus-visible:text-primary transition-all [&:focus-visible_svg]:text-primary"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com/Guruhbk" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary border border-border rounded-lg hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary focus-visible:text-primary transition-all [&:focus-visible_svg]:text-primary"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/guru_prasanth20/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-secondary border border-border rounded-lg hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:border-primary focus-visible:text-primary transition-all [&:focus-visible_svg]:text-primary"
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
              <Card 
                key={idx} 
                className="p-6 bg-card border-border hover:border-primary/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary transition-all group" 
                tabIndex={0}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-primary group-focus-visible:brightness-125">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold group-focus-visible:text-primary group-hover:text-primary transition-colors">{category.category}</h3>
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
              <Card 
                key={idx} 
                className="p-6 bg-card border-border hover:border-primary/50 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary transition-all group" 
                tabIndex={0}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold group-focus-visible:text-primary group-hover:text-primary transition-colors">{job.role}</h3>
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
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:brightness-110 transition-all"
              >
                Explore More
              </Button>
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <Link 
                key={blog.id} 
                to={`/blog/${blog.id}`}
                className="block focus-visible:outline-none group"
              >
                <Card className="overflow-hidden bg-card border-border hover:border-primary/50 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary group-focus-visible:border-primary group-focus-visible:ring-2 group-focus-visible:ring-primary transition-all h-full cursor-pointer">
                  {/* Featured Image */}
                  {blog.image && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={blog.image} 
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="p-6 space-y-4">
                    {/* Category Badge */}
                    {blog.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.date}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary group-focus-visible:text-primary transition-colors line-clamp-2">{blog.title}</h3>
                    <p className="text-muted-foreground line-clamp-3 text-sm">{blog.excerpt}</p>
                    <div className="inline-flex items-center text-primary group-hover:text-primary/80 transition-colors text-sm font-semibold">
                      Read More →
                    </div>
                  </div>
                </Card>
              </Link>
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
                href="https://www.linkedin.com/in/guru-prasanth-2003/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-all [&:focus-visible_svg]:text-primary"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/Guruhbk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-all [&:focus-visible_svg]:text-primary"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/guru_prasanth20/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded transition-all [&:focus-visible_svg]:text-primary"
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

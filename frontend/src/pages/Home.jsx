import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { ArrowRight, Download, Mail, Linkedin, Github, Calendar, MapPin, Briefcase, GraduationCap, Code2, Server, Cloud, GitBranch } from 'lucide-react';
import { mockData } from '../utils/mock';

const Home = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Load mock blogs
    setBlogs(mockData.blogs);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Mock form submission
    console.log('Contact form submitted:', formData);
    toast({
      title: "Message sent!",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleDownloadResume = () => {
    toast({
      title: "Download started",
      description: "Your resume is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#home" className="text-xl font-bold hover:text-[#d0d0d0] transition-colors">
              Guru Prasanth
            </a>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">About</a>
              <a href="#experience" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">Experience</a>
              <a href="#skills" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">Skills</a>
              <a href="#education" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">Education</a>
              <a href="#blog" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">Blog</a>
              <a href="#contact" className="text-sm text-[#a0a0a0] hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-[#a0a0a0]">
              Lead Engineer - Site Reliability
            </div>
            <h1 className="text-6xl md:text-7xl font-bold leading-tight">
              Guru Prasanth E
            </h1>
            <p className="text-xl text-[#a0a0a0] max-w-3xl leading-relaxed">
              A versatile IT professional with 9 years of experience spanning backend development and DevOps/Site Reliability Engineering. Currently leading site reliability initiatives, driving innovation and operational excellence.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                onClick={handleDownloadResume}
                className="bg-white text-black hover:bg-[#d0d0d0] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>
              <Button 
                variant="outline" 
                className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                Get in Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="flex gap-4 pt-6">
              <a 
                href="https://www.linkedin.com/in/guru-prasanth-2003" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:g.prasanth.7@gmail.com"
                className="p-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-[#0f0f0f]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-[#a0a0a0] leading-relaxed">
                With 9 years of comprehensive experience in the IT industry, I bring a unique blend of backend development expertise and DevOps/Site Reliability Engineering proficiency. My journey has evolved from crafting robust backend solutions to orchestrating large-scale infrastructure operations.
              </p>
              <p className="text-[#a0a0a0] leading-relaxed">
                Currently serving as a Lead Engineer in Site Reliability at Freshworks, I drive innovation in infrastructure automation, Kubernetes security, and large-scale data streaming platforms. My expertise spans AWS cloud infrastructure, containerization, CI/CD pipelines, and infrastructure as code.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-[#a0a0a0] leading-relaxed">
                I'm passionate about building resilient, scalable systems and mentoring teams to achieve operational excellence. My technical leadership extends to guiding cross-functional teams, establishing best practices, and ensuring 24/7 reliability for business-critical applications.
              </p>
              <div className="flex items-center gap-2 text-[#a0a0a0]">
                <MapPin className="w-4 h-4" />
                <span>Chennai, Tamil Nadu</span>
              </div>
              <div className="flex items-center gap-2 text-[#a0a0a0]">
                <Mail className="w-4 h-4" />
                <span>g.prasanth.7@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">Technical Skills</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.skills.map((category, idx) => (
              <Card key={idx} className="p-6 bg-[#0f0f0f] border-[#2a2a2a] hover:border-white transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {category.icon}
                  <h3 className="text-lg font-semibold">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-[#1a1a1a] text-sm text-[#a0a0a0] rounded-md">
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
      <section id="experience" className="py-20 px-6 bg-[#0f0f0f]">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">Work Experience</h2>
          <div className="space-y-6">
            {mockData.experience.map((job, idx) => (
              <Card key={idx} className="p-6 bg-[#0a0a0a] border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-semibold">{job.role}</h3>
                    <p className="text-lg text-[#a0a0a0]">{job.company}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#a0a0a0]">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{job.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#a0a0a0]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{job.location}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold mb-12">Education</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {mockData.education.map((edu, idx) => (
              <Card key={idx} className="p-6 bg-[#0f0f0f] border-[#2a2a2a] hover:border-white transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{edu.degree}</h3>
                    <p className="text-[#a0a0a0] mb-2">{edu.field}</p>
                    <p className="text-sm text-[#a0a0a0]">{edu.institution}</p>
                    <p className="text-sm text-[#a0a0a0]">{edu.year}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-6 bg-[#0f0f0f]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">Blog</h2>
            <Link to="/blog">
              <Button variant="outline" className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <Card key={blog.id} className="p-6 bg-[#0a0a0a] border-[#2a2a2a] hover:border-white transition-colors cursor-pointer">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
                    <Calendar className="w-4 h-4" />
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold">{blog.title}</h3>
                  <p className="text-[#a0a0a0] line-clamp-3">{blog.excerpt}</p>
                  <Link to={`/blog/${blog.id}`} className="inline-flex items-center text-white hover:text-[#d0d0d0] transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold mb-12 text-center">Get In Touch</h2>
          <Card className="p-8 bg-[#0f0f0f] border-[#2a2a2a]">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-[#a0a0a0]">Name</label>
                  <Input 
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#a0a0a0]">Email</label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0a0]">Message</label>
                <Textarea 
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  rows={6}
                  className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <Button type="submit" className="w-full bg-white text-black hover:bg-[#d0d0d0] transition-colors">
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#2a2a2a]">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[#a0a0a0] text-sm">
              © {new Date().getFullYear()} Guru Prasanth E. All rights reserved.
            </div>
            <div className="flex gap-4">
              <a 
                href="https://www.linkedin.com/in/guru-prasanth-2003" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#a0a0a0] hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="mailto:g.prasanth.7@gmail.com"
                className="text-[#a0a0a0] hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
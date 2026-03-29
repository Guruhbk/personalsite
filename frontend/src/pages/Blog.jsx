import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { mockData } from '../utils/mock';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setBlogs(mockData.blogs);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-[#d0d0d0] transition-colors">
              Guru Prasanth
            </Link>
            <Link to="/">
              <Button variant="outline" className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Blog Listing */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-[#a0a0a0] mb-12">Insights on DevOps, SRE, and Cloud Infrastructure</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Card key={blog.id} className="p-8 bg-[#0f0f0f] border-[#2a2a2a] hover:border-white transition-colors">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-[#a0a0a0]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{blog.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{blog.author}</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">{blog.title}</h2>
                  <p className="text-[#a0a0a0] leading-relaxed">{blog.excerpt}</p>
                  <Link to={`/blog/${blog.id}`}>
                    <Button className="bg-white text-black hover:bg-[#d0d0d0] transition-colors">
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
      <footer className="py-12 px-6 border-t border-[#2a2a2a]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-[#a0a0a0] text-sm">
            © {new Date().getFullYear()} Guru Prasanth E. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
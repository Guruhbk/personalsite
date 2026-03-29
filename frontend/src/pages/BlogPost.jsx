import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { mockData } from '../utils/mock';

const BlogPost = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const foundBlog = mockData.blogs.find(b => b.id === id);
    setBlog(foundBlog);
  }, [id]);

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <p className="text-xl text-[#a0a0a0]">Blog post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-[#2a2a2a]">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-bold hover:text-[#d0d0d0] transition-colors">
              Guru Prasanth
            </Link>
            <Link to="/blog">
              <Button variant="outline" className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Blog Post Content */}
      <article className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold">{blog.title}</h1>
              <div className="flex items-center gap-6 text-[#a0a0a0]">
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

            <div className="border-t border-[#2a2a2a] pt-8">
              <div className="prose prose-invert max-w-none">
                <div className="text-[#a0a0a0] leading-relaxed space-y-6 whitespace-pre-wrap">
                  {blog.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

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

export default BlogPost;
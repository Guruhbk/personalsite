import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';
import { Plus, Edit, Trash2, ArrowLeft, LogOut, Save } from 'lucide-react';
import { mockData } from '../utils/mock';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: ''
  });

  useEffect(() => {
    // Check authentication (MOCK)
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    // Load blogs from mock data
    setBlogs(mockData.blogs);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate('/admin/login');
  };

  const handleNewPost = () => {
    setIsEditing(true);
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '' });
  };

  const handleEditPost = (blog) => {
    setIsEditing(true);
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content
    });
  };

  const handleDeletePost = (id) => {
    // MOCK: In production, this will call backend API
    const updatedBlogs = blogs.filter(b => b.id !== id);
    setBlogs(updatedBlogs);
    toast({
      title: "Blog deleted",
      description: "The blog post has been deleted successfully.",
    });
  };

  const handleSavePost = (e) => {
    e.preventDefault();
    
    // MOCK: In production, this will save to backend
    if (editingBlog) {
      // Update existing blog
      const updatedBlogs = blogs.map(b => 
        b.id === editingBlog.id 
          ? { ...b, ...formData, date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }
          : b
      );
      setBlogs(updatedBlogs);
      toast({
        title: "Blog updated",
        description: "The blog post has been updated successfully.",
      });
    } else {
      // Create new blog
      const newBlog = {
        id: String(blogs.length + 1),
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        author: 'Guru Prasanth E'
      };
      setBlogs([newBlog, ...blogs]);
      toast({
        title: "Blog created",
        description: "The blog post has been created successfully.",
      });
    }
    
    setIsEditing(false);
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingBlog(null);
    setFormData({ title: '', excerpt: '', content: '' });
  };

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        {/* Header */}
        <header className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">
                {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <Button 
                onClick={handleCancel}
                variant="outline" 
                className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </header>

        {/* Editor Form */}
        <div className="container mx-auto px-6 py-12 max-w-4xl">
          <form onSubmit={handleSavePost} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0a0]">Title</label>
              <Input 
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors text-xl"
                placeholder="Enter blog title"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#a0a0a0]">Excerpt</label>
              <Textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                required
                rows={3}
                className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors resize-none"
                placeholder="Brief description of the blog post"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#a0a0a0]">Content (Markdown supported)</label>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                rows={20}
                className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors resize-none font-mono text-sm"
                placeholder="Write your blog content in markdown format..."
              />
              <p className="text-xs text-[#a0a0a0]">
                You can use Markdown syntax: # for headings, ** for bold, * for italic, etc.
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="bg-white text-black hover:bg-[#d0d0d0] transition-colors">
                <Save className="w-4 h-4 mr-2" />
                {editingBlog ? 'Update Post' : 'Publish Post'}
              </Button>
              <Button 
                type="button"
                onClick={handleCancel}
                variant="outline" 
                className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Blog Dashboard</h1>
            <div className="flex gap-4">
              <Link to="/">
                <Button variant="outline" className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View Site
                </Button>
              </Link>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Manage Blog Posts</h2>
            <p className="text-[#a0a0a0] mt-2">Create, edit, and delete your blog posts</p>
          </div>
          <Button 
            onClick={handleNewPost}
            className="bg-white text-black hover:bg-[#d0d0d0] transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        <div className="space-y-4">
          {blogs.length === 0 ? (
            <Card className="p-12 bg-[#0f0f0f] border-[#2a2a2a] text-center">
              <p className="text-[#a0a0a0]">No blog posts yet. Create your first post!</p>
            </Card>
          ) : (
            blogs.map((blog) => (
              <Card key={blog.id} className="p-6 bg-[#0f0f0f] border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                    <p className="text-[#a0a0a0] mb-3 line-clamp-2">{blog.excerpt}</p>
                    <p className="text-sm text-[#a0a0a0]">{blog.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleEditPost(blog)}
                      variant="outline" 
                      size="sm"
                      className="border-[#2a2a2a] hover:bg-[#1a1a1a] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      onClick={() => handleDeletePost(blog.id)}
                      variant="outline" 
                      size="sm"
                      className="border-[#2a2a2a] hover:bg-[#1a1a1a] hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

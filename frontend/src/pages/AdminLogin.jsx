import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // MOCK: In production, this will authenticate against backend
    console.log('Admin login attempted:', credentials);
    
    // Mock authentication
    if (credentials.username && credentials.password) {
      localStorage.setItem('adminToken', 'mock-token-12345');
      toast({
        title: "Login successful",
        description: "Redirecting to admin dashboard...",
      });
      setTimeout(() => navigate('/admin/dashboard'), 1000);
    } else {
      toast({
        title: "Login failed",
        description: "Please enter valid credentials.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8 bg-[#0f0f0f] border-[#2a2a2a]">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#1a1a1a] rounded-lg mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-[#a0a0a0]">Sign in to manage your blog</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0a0]">Username</label>
              <Input 
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0a0]">Password</label>
              <Input 
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="bg-[#1a1a1a] border-[#2a2a2a] focus:border-white transition-colors"
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full bg-white text-black hover:bg-[#d0d0d0] transition-colors">
              Sign In
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
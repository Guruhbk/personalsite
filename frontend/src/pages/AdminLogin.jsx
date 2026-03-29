import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { toast } from '../hooks/use-toast';
import { Lock } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AdminLogin = () => {
  const { theme } = useTheme();
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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 transition-colors duration-300">
      <Card className="w-full max-w-md p-8 bg-card border-border">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary rounded-lg mb-4">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-muted-foreground">Sign in to manage your blog</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Username</label>
              <Input 
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required
                className="bg-secondary border-border focus:border-primary transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Password</label>
              <Input 
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
                className="bg-secondary border-border focus:border-primary transition-colors"
                placeholder="Enter password"
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Sign In
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;
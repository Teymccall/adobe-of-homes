
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const AgentLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would verify credentials with a backend
    if (email && password) {
      toast({
        title: "Login Successful",
        description: "Welcome back to the Home Owner Dashboard!",
      });
      navigate('/home-owner-dashboard');
    } else {
      toast({
        title: "Login Failed",
        description: "Please enter valid credentials.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-ghana-primary flex items-center justify-center">
                <User className="text-white" size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Home Owner Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <a href="#" className="text-sm text-ghana-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2" size={16} />
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default AgentLogin;

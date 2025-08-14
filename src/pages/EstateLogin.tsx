
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
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

const EstateLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    if (user && userProfile) {
      if (userProfile.role === 'estate_manager') {
        navigate('/estate-management');
      } else {
        // User is logged in but not an estate manager
        toast({
          title: "Access Denied",
          description: "You don't have estate management privileges.",
          variant: "destructive"
        });
        navigate('/');
      }
    }
  }, [user, userProfile, navigate, toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use Firebase authentication
      const result = await signIn(email, password);
      
      if (result.profile) {
        // Check if user is an estate manager
        if (result.profile.role === 'estate_manager') {
          // Check if estate manager is active
          if (result.profile.status === 'suspended') {
            toast({
              title: "Access Denied",
              description: "Your account has been suspended. Please contact the administrator.",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Login Successful",
            description: `Welcome to Estate Management Dashboard, ${result.profile.displayName}!`,
          });
          
          navigate('/estate-management');
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have estate management privileges. Please use the appropriate login page.",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                <Building className="text-white" size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Estate Management Login</CardTitle>
            <CardDescription className="text-center">
              Access the estate management dashboard with your authorized credentials
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="text-sm text-muted-foreground text-center">
                Need access? Contact your system administrator to create an account.
              </div>
              <div className="text-xs text-blue-600 text-center">
                Check your email for password reset link after account creation.
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="mr-2" size={16} />
                {isLoading ? 'Signing In...' : 'Access Dashboard'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default EstateLogin;

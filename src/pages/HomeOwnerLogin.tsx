
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Home, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

const HomeOwnerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn(email, password);
      
      console.log('Login result:', result);
      console.log('User profile:', result.profile);
      console.log('User role:', result.profile?.role);
      
      // Check if user has home_owner role
      if (result.profile?.role === 'home_owner') {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        navigate('/home-owner-dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: `You don't have permission to access the home owner dashboard. Your role is: ${result.profile?.role || 'none'}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-ghana-primary flex items-center justify-center">
              <Home className="text-white" size={20} />
            </div>
            <span className="text-xl font-bold text-ghana-primary">GhanaHomes</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Home Owner Login</h1>
          <p className="text-gray-600 mt-2">Access your property management dashboard</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn size={20} />
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your home owner dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-ghana-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-ghana-primary hover:bg-ghana-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/apply-home-owner" 
                  className="text-ghana-primary hover:underline font-medium"
                >
                  Register as Home Owner
                </Link>
              </p>
            </div>

            {/* Help Information */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-800 font-medium mb-1">Need Help?</p>
              <p className="text-xs text-blue-600">
                If your application was approved, check your email for a password reset link.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                <strong>Important:</strong> Use the password you set via the reset link, not your Gmail password.
              </p>
              <p className="text-xs text-blue-600 mt-1">
                If you haven't received an email or need a new reset link, contact the admin.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2">
          <Link 
            to="/" 
            className="text-sm text-gray-500 hover:text-ghana-primary"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeOwnerLogin;

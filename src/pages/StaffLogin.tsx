
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, LogIn } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const StaffLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Note: Staff accounts are created by administrators through the admin dashboard
  // Staff members receive password reset emails to set their passwords

  // Check if user is already authenticated and redirect if needed
  useEffect(() => {
    // This will be handled by the AuthContext
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Use Firebase authentication
      const result = await signIn(email, password);
      
      if (result.profile) {
        // Debug: Log the user's role and status
        console.log('User profile:', result.profile);
        console.log('User role:', result.profile.role);
        console.log('User status:', result.profile.status);
        console.log('Expected roles:', ['admin', 'staff', 'estate_manager']);
        console.log('Role check result:', ['admin', 'staff', 'estate_manager'].includes(result.profile.role));
        
        // Check if user is a staff member (using correct role values from UserRole type)
        // Also handle potential variations in role naming
        const userRole = result.profile.role?.toLowerCase().replace(/[-_]/g, '');
        const allowedRoles = ['admin', 'staff', 'estatemanager'];
        
        console.log('Normalized user role:', userRole);
        console.log('Normalized allowed roles:', allowedRoles);
        console.log('Final role check result:', allowedRoles.includes(userRole));
        
        if (['admin', 'staff', 'estate_manager'].includes(result.profile.role) || allowedRoles.includes(userRole)) {
          // Check if staff is active
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
            description: `Welcome to Staff Dashboard, ${result.profile.displayName}!`,
          });
          
          // Redirect based on role
          if (result.profile.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/staff-dashboard');
          }
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have staff privileges. Please use the main login page.",
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

  // Note: Staff accounts are created by administrators through the admin dashboard

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <UserCog className="text-white" size={32} />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Staff Login</CardTitle>
              <CardDescription className="text-center">
                Access the staff dashboard with your authorized credentials
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
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  <LogIn className="mr-2" size={16} />
                  {isLoading ? 'Signing In...' : 'Access Dashboard'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Access Staff Dashboard</CardTitle>
              <CardDescription>
                Staff accounts are created by administrators. Contact your administrator if you need access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">1</div>
                  <div>
                    <h4 className="font-medium">Account Creation</h4>
                    <p className="text-sm text-muted-foreground">Administrators create staff accounts through the admin dashboard</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">2</div>
                  <div>
                    <h4 className="font-medium">Password Setup</h4>
                    <p className="text-sm text-muted-foreground">You'll receive a password reset email to set your password</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center mt-0.5">3</div>
                  <div>
                    <h4 className="font-medium">Login Access</h4>
                    <p className="text-sm text-muted-foreground">Use your email and password to access the staff dashboard</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Need access?</strong> Contact your system administrator to create an account for you.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StaffLogin;

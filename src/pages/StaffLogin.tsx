
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
        
        // Simplified role checking - check for exact matches first
        const userRole = result.profile.role;
        const allowedRoles = ['admin', 'staff', 'estate_manager'];
        
        console.log('User role:', userRole);
        console.log('Allowed roles:', allowedRoles);
        console.log('Role check result:', allowedRoles.includes(userRole));
        
        // Check if user has staff privileges
        if (allowedRoles.includes(userRole)) {
          // Check if staff is active
          if (result.profile.status === 'suspended') {
            toast({
              title: "Access Denied",
              description: "Your account has been suspended. Please contact the administrator.",
              variant: "destructive"
            });
            return;
          }
          
          // Check if status is active
          if (result.profile.status !== 'active') {
            toast({
              title: "Access Denied",
              description: "Your account is not active. Please contact the administrator.",
              variant: "destructive"
            });
            return;
          }
          
          toast({
            title: "Login Successful",
            description: `Welcome to Staff Dashboard, ${result.profile.displayName || result.profile.email}!`,
          });
          
          // Redirect based on role
          if (result.profile.role === 'admin') {
            navigate('/admin-dashboard');
          } else {
            navigate('/staff-dashboard');
          }
        } else {
          // Additional check: Query Firestore to verify staff status
          console.log('Role not found in profile, checking Firestore...');
          
          try {
            const staffQuery = query(
              collection(db, 'users'),
              where('email', '==', email.toLowerCase())
            );
            const staffSnapshot = await getDocs(staffQuery);
            
            if (!staffSnapshot.empty) {
              const staffDoc = staffSnapshot.docs[0];
              const staffData = staffDoc.data();
              
              console.log('Firestore staff data:', staffData);
              
              if (allowedRoles.includes(staffData.role) && staffData.status === 'active') {
                toast({
                  title: "Login Successful",
                  description: `Welcome to Staff Dashboard, ${staffData.displayName || staffData.email}!`,
                });
                
                // Redirect based on role
                if (staffData.role === 'admin') {
                  navigate('/admin-dashboard');
                } else {
                  navigate('/staff-dashboard');
                }
                return;
              }
            }
          } catch (firestoreError) {
            console.error('Error checking Firestore:', firestoreError);
          }
          
          toast({
            title: "Access Denied",
            description: "You don't have staff privileges. Please use the main login page.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Unable to retrieve user profile. Please try again.",
          variant: "destructive"
        });
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Login Form */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-4">
                  <UserCog className="text-white" size={24} />
                </div>
                <CardTitle className="text-2xl font-bold">Staff Login</CardTitle>
                <CardDescription>
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
          </div>

          {/* Right side - Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How to Access Staff Dashboard
              </h2>
              <p className="text-gray-600 text-lg">
                Staff accounts are created by administrators. Contact your administrator if you need access.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Account Creation</h3>
                  <p className="text-gray-600">Administrators create staff accounts through the admin dashboard</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Password Setup</h3>
                  <p className="text-gray-600">You'll receive a password reset email to set your password</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Login Access</h3>
                  <p className="text-gray-600">Use your email and password to access the staff dashboard</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Need Help?</strong> Contact your system administrator to create an account for you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StaffLogin;

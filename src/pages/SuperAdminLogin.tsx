
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, ShieldAlert, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, user, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in as admin
  React.useEffect(() => {
    if (user && userProfile && userProfile.role === 'admin') {
      navigate('/admin-dashboard');
    }
  }, [user, userProfile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signIn(email, password);
      
      if (result.profile?.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Admin Login Successful",
        description: "Welcome to the Admin Dashboard!",
      });
      navigate('/admin-dashboard');
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Invalid credentials.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await signUp(email, password, displayName, 'admin', {
        status: 'active', // Auto-approve admin accounts
        isVerified: true
      });

      toast({
        title: "Super Admin Account Created!",
        description: "Your admin account has been created and stored in Firebase. Redirecting to dashboard...",
      });
      
      // Small delay to show the success message
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1500);
    } catch (error: any) {
      toast({
        title: "Account Creation Failed",
        description: error.message || "Failed to create admin account.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-16">
        <Card className="border-2 border-red-500">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                <ShieldAlert className="text-white" size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {isCreatingAccount ? 'Create Super Admin' : 'Super Admin Login'}
            </CardTitle>
            <CardDescription className="text-center">
              {isCreatingAccount 
                ? 'Create the initial admin account' 
                : 'Restricted access. Authorized personnel only.'
              }
            </CardDescription>
          </CardHeader>

          {!isCreatingAccount && (
            <div className="px-6 pb-4">
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Super Administrator Access</strong>
                  <br />
                  Sign in with your admin credentials or create a new admin account.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {isCreatingAccount && (
            <div className="px-6 pb-4">
              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Create Super Admin Account</strong>
                  <br />
                  This will create your admin account with full platform access and store it securely in Firebase.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <form onSubmit={isCreatingAccount ? handleCreateSuperAdmin : handleLogin}>
            <CardContent className="space-y-4">
              {isCreatingAccount && (
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Enter your full name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {isCreatingAccount ? 'Admin Email' : 'Email'}
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder={isCreatingAccount ? "your-email@company.com" : "Enter your email"}
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
                  placeholder={isCreatingAccount ? "Create a secure password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                {isCreatingAccount && (
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters long
                  </p>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={loading}
              >
                {loading ? (
                  "Processing..."
                ) : isCreatingAccount ? (
                  <>
                    <UserPlus className="mr-2" size={16} />
                    Create Super Admin
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2" size={16} />
                    Access Admin Dashboard
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                variant={isCreatingAccount ? "outline" : "default"}
                className="w-full"
                onClick={() => {
                  setIsCreatingAccount(!isCreatingAccount);
                  setEmail('');
                  setPassword('');
                  setDisplayName('');
                }}
                disabled={loading}
              >
                {isCreatingAccount ? (
                  'Back to Login'
                ) : (
                  <>
                    <UserPlus className="mr-2" size={16} />
                    Sign Up as Super Admin
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default SuperAdminLogin;

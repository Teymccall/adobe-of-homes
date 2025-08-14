import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/services/authService';

interface FirebaseLoginProps {
  role?: UserRole;
  title?: string;
  description?: string;
}

const FirebaseLogin: React.FC<FirebaseLoginProps> = ({ 
  role = 'home_owner', 
  title = 'Sign In',
  description = 'Enter your credentials to access your account'
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, signUp, user, userProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          setError('Display name is required');
          return;
        }
        await signUp(email, password, displayName, role);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    const { signOut } = useAuth();
    try {
      await signOut();
    } catch (error: any) {
      console.error('Sign out error:', error);
    }
  };

  if (user && userProfile) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>You are signed in as {userProfile.displayName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>Email:</strong> {userProfile.email}</p>
            <p><strong>Role:</strong> {userProfile.role}</p>
            <p><strong>Status:</strong> {userProfile.status}</p>
            <p><strong>Verified:</strong> {userProfile.isVerified ? 'Yes' : 'No'}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
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
            <Label htmlFor="email">Email</Label>
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
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </Button>
          </div>

          {role && (
            <div className="text-center text-sm text-gray-500">
              Signing up as: <strong>{role.replace('_', ' ')}</strong>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default FirebaseLogin; 
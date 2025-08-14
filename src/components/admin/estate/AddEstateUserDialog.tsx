
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { adminService } from '@/services/adminService';

interface EstateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  estateProperty: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AddEstateUserDialogProps {
  onAddUser: (user: EstateUser) => void;
}

const AddEstateUserDialog = ({ onAddUser }: AddEstateUserDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    estateProperty: ''
  });

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.estateProperty) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const userData = {
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        estate: newUser.estateProperty,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      console.log('Creating new estate user:', userData);

      // Use adminService to add the user to Firebase
      const userId = await adminService.addEstateUser(userData);
      
      const user: EstateUser = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        estateProperty: newUser.estateProperty,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddUser(user);

      toast({
        title: "Estate User Created",
        description: `Account created for ${newUser.name}. Password reset email sent to ${newUser.email}`,
      });

      setNewUser({ name: '', email: '', phone: '', estateProperty: '' });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding estate user:', error);
      toast({
        title: "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Estate User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Estate Management User</DialogTitle>
          <DialogDescription>
            Grant access to the estate management system for a new user.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name *</label>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Enter full name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Email Address *</label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Estate/Property *</label>
            <Input
              value={newUser.estateProperty}
              onChange={(e) => setNewUser({ ...newUser, estateProperty: e.target.value })}
              placeholder="Enter estate or property name"
            />
          </div>
          <div className="text-sm text-muted-foreground text-center p-3 bg-blue-50 rounded-md">
            <p>Password will be automatically generated and sent via email.</p>
          </div>
          <Button onClick={handleAddUser} className="w-full">
            Grant Access
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEstateUserDialog;

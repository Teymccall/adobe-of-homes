
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Staff } from '../StaffManagement';
import { adminService } from '@/services/adminService';

interface AddStaffDialogProps {
  onAddStaff: (staff: Staff) => void;
}

const AVAILABLE_PRIORITIES = [
  { id: 'property_verification', label: 'Property Verification' },
  { id: 'estate_management', label: 'Estate Management' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'user_management', label: 'User Management' },
  { id: 'system_settings', label: 'System Settings' },
];

const STAFF_ROLES = [
  'Property Verifier',
  'Estate Manager',
  'Customer Support',
  'System Administrator',
  'Reports Analyst',
];

const AddStaffDialog = ({ onAddStaff }: AddStaffDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    priorities: [] as string[],
    location: ''
  });

  const handlePriorityChange = (priorityId: string, checked: boolean) => {
    if (checked) {
      setNewStaff(prev => ({
        ...prev,
        priorities: [...prev.priorities, priorityId]
      }));
    } else {
      setNewStaff(prev => ({
        ...prev,
        priorities: prev.priorities.filter(p => p !== priorityId)
      }));
    }
  };

  const handleAddStaff = async () => {
    if (!newStaff.name || !newStaff.email || !newStaff.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (newStaff.priorities.length === 0) {
      toast({
        title: "No Access Priorities",
        description: "Please select at least one access priority for the staff member.",
        variant: "destructive"
      });
      return;
    }

    try {
      const userData = {
        displayName: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        permissions: newStaff.priorities,
        location: newStaff.location,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      console.log('Creating new staff member:', userData);

      // Use adminService to add the staff to Firebase
      const staffId = await adminService.addStaffUser(userData);
      
      const staff: Staff = {
        id: staffId,
        name: newStaff.name,
        email: newStaff.email,
        phone: newStaff.phone,
        role: newStaff.role,
        priorities: newStaff.priorities,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };

      onAddStaff(staff);

      toast({
        title: "Staff Account Created",
        description: `Account created for ${newStaff.name}. Password reset email sent to ${newStaff.email}`,
      });

      setNewStaff({ 
        name: '', 
        email: '', 
        phone: '', 
        role: '', 
        priorities: [], 
        location: '' 
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: "Error",
        description: "Failed to add staff. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Register a new staff member and assign their access priorities.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email Address *</label>
              <Input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Location</label>
              <Input
                value={newStaff.location}
                onChange={(e) => setNewStaff({ ...newStaff, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Role *</label>
            <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-3 block">Access Priorities *</label>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_PRIORITIES.map((priority) => (
                <div key={priority.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={priority.id}
                    checked={newStaff.priorities.includes(priority.id)}
                    onCheckedChange={(checked) => handlePriorityChange(priority.id, checked as boolean)}
                  />
                  <label htmlFor={priority.id} className="text-sm">
                    {priority.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center p-3 bg-blue-50 rounded-md">
            <p>Password will be automatically generated and sent via email.</p>
          </div>
          
          <Button onClick={handleAddStaff} className="w-full">
            Add Staff Member
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;

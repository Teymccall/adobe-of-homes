
import React, { useState } from 'react';
import { Plus, User, Mail, Phone, MapPin, Briefcase, Shield, CheckCircle } from 'lucide-react';
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
  { id: 'property_verification', label: 'Property Verification', icon: Shield },
  { id: 'estate_management', label: 'Estate Management', icon: Briefcase },
  { id: 'reports', label: 'Reports & Analytics', icon: CheckCircle },
  { id: 'user_management', label: 'User Management', icon: User },
  { id: 'system_settings', label: 'System Settings', icon: Shield },
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
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
          <DialogDescription>
            Create a new staff account. They will receive a password reset email to set their password.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Full Name and Email - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User size={16} className="text-gray-600" />
                Full Name *
              </label>
              <Input
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                placeholder="Enter full name"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail size={16} className="text-gray-600" />
                Email Address *
              </label>
              <Input
                type="email"
                value={newStaff.email}
                onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                placeholder="staff@company.com"
                className="w-full"
              />
            </div>
          </div>
          
          {/* Phone and Location - Stack on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone size={16} className="text-gray-600" />
                Phone Number
              </label>
              <Input
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                placeholder="+233 XX XXX XXXX"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin size={16} className="text-gray-600" />
                Location
              </label>
              <Input
                value={newStaff.location}
                onChange={(e) => setNewStaff({ ...newStaff, location: e.target.value })}
                placeholder="City, Region"
                className="w-full"
              />
            </div>
          </div>
          
          {/* Role - Full width */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Briefcase size={16} className="text-gray-600" />
              Role *
            </label>
            <Select value={newStaff.role} onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}>
              <SelectTrigger className="w-full">
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
          
          {/* Access Priorities - Responsive grid */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Shield size={16} className="text-gray-600" />
              Access Priorities *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AVAILABLE_PRIORITIES.map((priority) => {
                const IconComponent = priority.icon;
                return (
                  <div key={priority.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={priority.id}
                      checked={newStaff.priorities.includes(priority.id)}
                      onCheckedChange={(checked) => handlePriorityChange(priority.id, checked as boolean)}
                    />
                    <label htmlFor={priority.id} className="text-sm flex items-center gap-2 cursor-pointer flex-1">
                      <IconComponent size={16} className="text-gray-600" />
                      {priority.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p>Password will be automatically generated and sent via email.</p>
          </div>
          
          <Button onClick={handleAddStaff} className="w-full">
            <Plus size={16} className="mr-2" />
            Create Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;

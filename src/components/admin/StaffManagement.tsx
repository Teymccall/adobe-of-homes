
import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, UserPlus, Mail, Phone, MapPin, Shield, CheckCircle, X, Filter, Download, Upload, Users, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { auth, db } from '@/lib/firebase';
import { fixExistingStaffAccounts, checkStaffAccountStructure, checkForOrphanedStaffAccounts } from '@/utils/fixStaffAccounts';
import { 
  collection, 
  doc, 
  addDoc, 
  setDoc,
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile 
} from 'firebase/auth';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

interface StaffMember {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  location: string;
  role: 'admin' | 'staff' | 'moderator';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
  profileImage?: string;
  bio?: string;
  createdAt: Date;
  lastActive?: Date;
  isVerified: boolean;
  createdBy: string;
}

const staffSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 characters" }),
  location: z.string().min(2, { message: "Location must be at least 2 characters" }),
  role: z.enum(['admin', 'staff', 'moderator']),
  department: z.string().min(2, { message: "Department must be at least 2 characters" }),
  bio: z.string().optional(),
  permissions: z.array(z.string()).optional(),
});

const StaffManagement = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const form = useForm<z.infer<typeof staffSchema>>({
    resolver: zodResolver(staffSchema),
    defaultValues: {
      displayName: '',
      email: '',
      phone: '',
      location: '',
      role: 'staff',
      department: '',
      bio: '',
      permissions: [],
    },
  });

  // Fetch staff members from Firebase
  const fetchStaffMembers = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Fetching staff members...');
      
      const staffRef = collection(db, 'users');
      const q = query(
        staffRef,
        where('role', 'in', ['admin', 'staff', 'moderator'])
        // Temporarily removed orderBy to avoid index requirement
        // orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      console.log(`Found ${querySnapshot.size} staff documents`);
      
      const staffData: StaffMember[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`Processing document ${doc.id}:`, data.email);
        
        staffData.push({
          id: data.uid, // Use uid instead of doc.id for unique keys
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          phone: data.phone || '',
          location: data.location || '',
          role: data.role,
          department: data.company || '', // Map company back to department for display
          status: data.status || 'active',
          permissions: data.skills || [], // Map skills back to permissions for display
          profileImage: data.profileImage,
          bio: data.bio,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastActive: data.lastActive?.toDate(),
          isVerified: data.isVerified || false,
          createdBy: data.createdBy || '',
        });
      });
      
      // Sort in memory to avoid index requirement
      const sortedStaffData = staffData.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      );
      
      console.log(`Setting ${sortedStaffData.length} staff members in state`);
      setStaffMembers(sortedStaffData);
      
    } catch (error) {
      console.error('Error fetching staff members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch staff members.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  // Create new staff account
  const createStaffAccount = async (values: z.infer<typeof staffSchema>) => {
    try {
      setIsCreating(true);
      
      // Generate a temporary password
      const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-4) + '!1';
      
      // Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, tempPassword);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, {
        displayName: values.displayName
      });
      
      // Create staff profile in Firestore using the correct UserProfile structure
      const staffData = {
        uid: user.uid,
        email: values.email,
        displayName: values.displayName,
        phone: values.phone,
        location: values.location,
        role: values.role,
        company: values.department, // Map department to company field
        status: 'active',
        skills: values.permissions || [], // Map permissions to skills field
        bio: values.bio || '',
        isVerified: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(), // Add missing updatedAt field
        createdBy: userProfile?.uid || '',
      };
      
      // Use setDoc with user.uid as document ID to match AuthService expectations
      await setDoc(doc(db, 'users', user.uid), staffData);
      
      // Send password reset email so they can set their own password
      await sendPasswordResetEmail(auth, values.email);
      
      toast({
        title: "Staff Account Created",
        description: `Account created for ${values.displayName}. Password reset email sent to ${values.email}`,
      });
      
      setIsDialogOpen(false);
      form.reset();
      fetchStaffMembers();
      
    } catch (error: any) {
      console.error('Error creating staff account:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create staff account.",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Update staff member
  const updateStaffMember = async (values: z.infer<typeof staffSchema>) => {
    if (!selectedStaff) return;
    
    try {
      setIsEditing(true);
      
      const staffRef = doc(db, 'users', selectedStaff.uid); // Use uid instead of id
      await updateDoc(staffRef, {
        displayName: values.displayName,
        phone: values.phone,
        location: values.location,
        role: values.role,
        company: values.department, // Map department to company
        bio: values.bio || '',
        skills: values.permissions || [], // Map permissions to skills
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Staff Updated",
        description: `${values.displayName}'s information has been updated.`,
      });
      
      setIsDialogOpen(false);
      setSelectedStaff(null);
      form.reset();
      fetchStaffMembers();
      
    } catch (error: any) {
      console.error('Error updating staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member.",
        variant: "destructive"
      });
    } finally {
      setIsEditing(false);
    }
  };

  // Delete staff member
  const deleteStaffMember = async () => {
    if (!selectedStaff) return;
    
    try {
      console.log('Deleting staff member:', selectedStaff.email);
      
      // First, delete the Firestore document
      await deleteDoc(doc(db, 'users', selectedStaff.uid));
      console.log('✅ Firestore document deleted');
      
      // Then, try to delete the Firebase Auth user
      try {
        // Note: This requires admin privileges, so we'll just log it
        console.log('Note: Firebase Auth user deletion requires admin SDK');
        console.log('The user can still log in but won\'t have a profile');
      } catch (authError) {
        console.log('Auth user deletion failed (expected):', authError);
      }
      
      toast({
        title: "Staff Deleted",
        description: `${selectedStaff.displayName} has been removed from the system.`,
      });
      
      setIsDeleteDialogOpen(false);
      setSelectedStaff(null);
      
      // Force refresh the staff list
      await fetchStaffMembers();
      
    } catch (error: any) {
      console.error('Error deleting staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete staff member.",
        variant: "destructive"
      });
    }
  };

  // Toggle staff status
  const toggleStaffStatus = async (staffId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      // Find the staff member by id to get their uid
      const staffMember = staffMembers.find(staff => staff.id === staffId);
      if (!staffMember) {
        throw new Error('Staff member not found');
      }
      const staffRef = doc(db, 'users', staffMember.uid);
      await updateDoc(staffRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      
      toast({
        title: "Status Updated",
        description: `Staff status changed to ${newStatus}.`,
      });
      
      fetchStaffMembers();
      
    } catch (error: any) {
      console.error('Error updating staff status:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update staff status.",
        variant: "destructive"
      });
    }
  };

  // Reset staff password
  const resetStaffPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Password Reset",
        description: `Password reset email sent to ${email}`,
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive"
      });
    }
  };

  // Open create dialog
  const openCreateDialog = () => {
    setSelectedStaff(null);
    setIsEditing(false);
    form.reset();
    setIsDialogOpen(true);
  };

  // Open edit dialog
  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setIsEditing(true);
    form.reset({
      displayName: staff.displayName,
      email: staff.email,
      phone: staff.phone,
      location: staff.location,
      role: staff.role,
      department: staff.department,
      bio: staff.bio || '',
      permissions: staff.permissions,
    });
    setIsDialogOpen(true);
  };

  // Filter staff members
  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = staff.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         staff.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'secondary';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'staff': return 'default';
      case 'moderator': return 'secondary';
      default: return 'default';
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'ST';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
          <p className="text-gray-600">Manage staff accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={openCreateDialog} className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Staff Member
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              await checkStaffAccountStructure();
              await fixExistingStaffAccounts();
            }}
            className="gap-2"
          >
            🔧 Fix Staff Accounts
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              await checkForOrphanedStaffAccounts();
            }}
            className="gap-2"
          >
            🔍 Check Duplicates
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchStaffMembers}
            className="gap-2"
            disabled={isLoading}
          >
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staffMembers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold">{staffMembers.filter(s => s.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold">{staffMembers.filter(s => s.role === 'admin').length}</p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold">{staffMembers.filter(s => s.status === 'suspended').length}</p>
              </div>
              <X className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="moderator">Moderator</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members ({filteredStaff.length})</CardTitle>
          <CardDescription>Manage your team members and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading staff members...</p>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No staff members found</p>
              <p>No staff members match your current filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role & Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={staff.profileImage} alt={staff.displayName} />
                          <AvatarFallback>{getInitials(staff.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{staff.displayName}</p>
                          <p className="text-sm text-gray-500">{staff.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {staff.phone}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {staff.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <Badge variant={getRoleColor(staff.role) as any} className="capitalize">
                          {staff.role}
                        </Badge>
                        <p className="text-sm text-gray-600">{staff.department}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(staff.status) as any} className="capitalize">
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{formatDate(staff.createdAt)}</p>
                        {staff.lastActive && (
                          <p className="text-gray-500">Last active: {formatDate(staff.lastActive)}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(staff)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetStaffPassword(staff.email)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStaffStatus(staff.id, staff.status)}
                        >
                          {staff.status === 'active' ? <X className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedStaff(staff)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Staff Member</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete {staff.displayName}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  setSelectedStaff(staff);
                                  setIsDeleteDialogOpen(true);
                                }}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Staff Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update staff member information and permissions.'
                : 'Create a new staff account. They will receive a password reset email to set their password.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(isEditing ? updateStaffMember : createStaffAccount)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="staff@company.com" 
                          {...field}
                          disabled={isEditing} // Can't change email when editing
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+233 XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, Region" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="moderator">Moderator</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Customer Support, IT" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description about the staff member..."
                        className="min-h-[80px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreating || isEditing}
                  className="gap-2"
                >
                  {isCreating || isEditing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {isCreating ? 'Creating...' : 'Updating...'}
                    </>
                  ) : (
                    <>
                      {isEditing ? <Edit className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                      {isEditing ? 'Update Staff' : 'Create Staff'}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member
              and remove their access to the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteStaffMember}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Staff Member
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;

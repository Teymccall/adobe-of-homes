
import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AddEstateUserDialog from './estate/AddEstateUserDialog';
import EstateUsersTable from './estate/EstateUsersTable';
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

const EstateUserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<EstateUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load users from Firebase on component mount
  useEffect(() => {
    const fetchEstateUsers = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getEstateUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching estate users:', error);
        toast({
          title: "Error",
          description: "Failed to load estate users. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstateUsers();
  }, [toast]);

  const handleAddUser = (user: EstateUser) => {
    console.log('Adding new user to list:', user);
    setUsers(prevUsers => [...prevUsers, user]);
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      const updatedStatus = user?.status === 'active' ? 'inactive' : 'active';
      
      await adminService.updateUserStatus(userId, updatedStatus);
      
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ));

      toast({
        title: "Status Updated",
        description: `${user?.name}'s access has been ${user?.status === 'active' ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const removeUser = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      
      await adminService.deleteUser(userId);
      
      setUsers(users.filter(u => u.id !== userId));

      toast({
        title: "User Removed",
        description: `${user?.name} has been removed from the system.`,
      });
    } catch (error) {
      console.error('Error removing user:', error);
      toast({
        title: "Error",
        description: "Failed to remove user. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Building size={24} />
              Estate Management Users ({users.length})
            </CardTitle>
            <AddEstateUserDialog onAddUser={handleAddUser} />
          </div>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No estate users found. Click "Add Estate User" to create one.
            </div>
          ) : (
            <EstateUsersTable
              users={users}
              onToggleStatus={toggleUserStatus}
              onRemoveUser={removeUser}
            />
          )}
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading estate users...</p>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Debug Information</h3>
        <p className="text-sm text-blue-700">
          Users in memory: {users.length}
        </p>
        <p className="text-sm text-blue-700">
          Data source: Firebase Firestore
        </p>
      </div>
    </div>
  );
};

export default EstateUserManagement;


import React from 'react';
import { UserCog } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StaffUser {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
}

interface StaffUserInfoProps {
  user: StaffUser;
}

const StaffUserInfo = ({ user }: StaffUserInfoProps) => {
  const getPriorityLabel = (priorityId: string) => {
    const priorityMap: { [key: string]: string } = {
      'property_verification': 'Property Verification',
      'estate_management': 'Estate Management',
      'reports': 'Reports & Analytics',
      'user_management': 'User Management',
      'system_settings': 'System Settings'
    };
    return priorityMap[priorityId] || priorityId;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog size={20} />
          Your Account Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Access Permissions</p>
          <div className="flex flex-wrap gap-2">
            {user.permissions && user.permissions.length > 0 ? (
              user.permissions.map((permission) => (
                <Badge key={permission} variant="secondary" className="text-xs">
                  {getPriorityLabel(permission)}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No permissions assigned</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StaffUserInfo;

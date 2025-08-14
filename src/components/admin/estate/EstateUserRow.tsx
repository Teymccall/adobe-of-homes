
import React from 'react';
import { Trash2, User, Mail, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

interface EstateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  estateProperty: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface EstateUserRowProps {
  user: EstateUser;
  onToggleStatus: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

const EstateUserRow = ({ user, onToggleStatus, onRemoveUser }: EstateUserRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <User size={16} />
          <span className="font-medium">{user.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail size={12} />
            {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone size={12} />
              {user.phone}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Building size={14} />
          {user.estateProperty}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {user.createdAt}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(user.id)}
          >
            {user.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemoveUser(user.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EstateUserRow;

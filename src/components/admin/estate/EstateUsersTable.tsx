
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import EstateUserRow from './EstateUserRow';

interface EstateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  estateProperty: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface EstateUsersTableProps {
  users: EstateUser[];
  onToggleStatus: (userId: string) => void;
  onRemoveUser: (userId: string) => void;
}

const EstateUsersTable = ({ users, onToggleStatus, onRemoveUser }: EstateUsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Estate/Property</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <EstateUserRow
            key={user.id}
            user={user}
            onToggleStatus={onToggleStatus}
            onRemoveUser={onRemoveUser}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default EstateUsersTable;


import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StaffRow from './StaffRow';
import { Staff } from '../StaffManagement';

interface StaffTableProps {
  staffs: Staff[];
  onToggleStatus: (staffId: string) => void;
  onUpdatePriorities: (staffId: string, priorities: string[]) => void;
  onRemoveStaff: (staffId: string) => void;
}

const StaffTable = ({ staffs, onToggleStatus, onUpdatePriorities, onRemoveStaff }: StaffTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Staff Member</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Access Priorities</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {staffs.map((staff) => (
          <StaffRow
            key={staff.id}
            staff={staff}
            onToggleStatus={onToggleStatus}
            onUpdatePriorities={onUpdatePriorities}
            onRemoveStaff={onRemoveStaff}
          />
        ))}
      </TableBody>
    </Table>
  );
};

export default StaffTable;

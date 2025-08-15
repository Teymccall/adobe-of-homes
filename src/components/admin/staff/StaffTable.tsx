
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
    <div className="w-full overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xs md:text-sm font-medium">Staff Member</TableHead>
            <TableHead className="text-xs md:text-sm font-medium">Contact</TableHead>
            <TableHead className="text-xs md:text-sm font-medium">Role</TableHead>
            <TableHead className="text-xs md:text-sm font-medium">Access Priorities</TableHead>
            <TableHead className="text-xs md:text-sm font-medium">Status</TableHead>
            <TableHead className="text-xs md:text-sm font-medium hidden md:table-cell">Created</TableHead>
            <TableHead className="text-xs md:text-sm font-medium">Actions</TableHead>
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
    </div>
  );
};

export default StaffTable;

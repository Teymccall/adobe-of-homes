
import React, { useState } from 'react';
import { Trash2, UserCog, Mail, Phone, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { Staff } from '../StaffManagement';

interface StaffRowProps {
  staff: Staff;
  onToggleStatus: (staffId: string) => void;
  onUpdatePriorities: (staffId: string, priorities: string[]) => void;
  onRemoveStaff: (staffId: string) => void;
}

const AVAILABLE_PRIORITIES = [
  { id: 'property_verification', label: 'Property Verification' },
  { id: 'estate_management', label: 'Estate Management' },
  { id: 'reports', label: 'Reports & Analytics' },
  { id: 'user_management', label: 'User Management' },
  { id: 'system_settings', label: 'System Settings' },
];

const StaffRow = ({ staff, onToggleStatus, onUpdatePriorities, onRemoveStaff }: StaffRowProps) => {
  const [isEditingPriorities, setIsEditingPriorities] = useState(false);
  const [tempPriorities, setTempPriorities] = useState<string[]>(staff.priorities);

  const handlePriorityChange = (priorityId: string, checked: boolean) => {
    if (checked) {
      setTempPriorities(prev => [...prev, priorityId]);
    } else {
      setTempPriorities(prev => prev.filter(p => p !== priorityId));
    }
  };

  const handleSavePriorities = () => {
    onUpdatePriorities(staff.id, tempPriorities);
    setIsEditingPriorities(false);
  };

  const handleCancelEdit = () => {
    setTempPriorities(staff.priorities);
    setIsEditingPriorities(false);
  };

  const getPriorityLabel = (priorityId: string) => {
    const priority = AVAILABLE_PRIORITIES.find(p => p.id === priorityId);
    return priority?.label || priorityId;
  };

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <UserCog size={16} />
          <span className="font-medium">{staff.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Mail size={12} />
            {staff.email}
          </div>
          {staff.phone && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Phone size={12} />
              {staff.phone}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline">{staff.role}</Badge>
      </TableCell>
      <TableCell>
        {isEditingPriorities ? (
          <div className="space-y-2 min-w-48">
            {AVAILABLE_PRIORITIES.map((priority) => (
              <div key={priority.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`${staff.id}-${priority.id}`}
                  checked={tempPriorities.includes(priority.id)}
                  onCheckedChange={(checked) => handlePriorityChange(priority.id, checked as boolean)}
                />
                <label htmlFor={`${staff.id}-${priority.id}`} className="text-xs">
                  {priority.label}
                </label>
              </div>
            ))}
            <div className="flex gap-1 mt-2">
              <Button size="sm" onClick={handleSavePriorities}>
                <Save size={12} />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                <X size={12} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {staff.priorities.map((priority) => (
              <Badge key={priority} variant="secondary" className="text-xs mr-1">
                {getPriorityLabel(priority)}
              </Badge>
            ))}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingPriorities(true)}
              className="ml-2"
            >
              <Edit size={12} />
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Badge variant={staff.status === 'active' ? 'default' : 'secondary'}>
          {staff.status}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {staff.createdAt}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(staff.id)}
          >
            {staff.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemoveStaff(staff.id)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StaffRow;

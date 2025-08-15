
import React, { useState } from 'react';
import { Trash2, UserCog, Mail, Phone, Edit, Save, X, Shield, Briefcase, CheckCircle } from 'lucide-react';
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
  { id: 'property_verification', label: 'Property Verification', icon: Shield },
  { id: 'estate_management', label: 'Estate Management', icon: Briefcase },
  { id: 'reports', label: 'Reports & Analytics', icon: CheckCircle },
  { id: 'user_management', label: 'User Management', icon: UserCog },
  { id: 'system_settings', label: 'System Settings', icon: Shield },
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

  const getPriorityIcon = (priorityId: string) => {
    const priority = AVAILABLE_PRIORITIES.find(p => p.id === priorityId);
    return priority?.icon || Shield;
  };

  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell className="py-4">
        <div className="flex items-center gap-2">
          <UserCog size={16} className="text-blue-600" />
          <span className="font-medium text-sm md:text-base">{staff.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs md:text-sm">
            <Mail size={12} className="text-gray-500" />
            <span className="truncate max-w-[120px] md:max-w-none">{staff.email}</span>
          </div>
          {staff.phone && (
            <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
              <Phone size={12} className="text-gray-500" />
              <span className="truncate max-w-[120px] md:max-w-none">{staff.phone}</span>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge variant="outline" className="text-xs">
          {staff.role}
        </Badge>
      </TableCell>
      <TableCell className="py-4">
        {isEditingPriorities ? (
          <div className="space-y-3 min-w-48 max-w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_PRIORITIES.map((priority) => {
                const IconComponent = priority.icon;
                return (
                  <div key={priority.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-gray-50 transition-colors">
                    <Checkbox
                      id={`${staff.id}-${priority.id}`}
                      checked={tempPriorities.includes(priority.id)}
                      onCheckedChange={(checked) => handlePriorityChange(priority.id, checked as boolean)}
                    />
                    <label htmlFor={`${staff.id}-${priority.id}`} className="text-xs flex items-center gap-1 cursor-pointer flex-1">
                      <IconComponent size={12} className="text-gray-600" />
                      <span className="truncate">{priority.label}</span>
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" onClick={handleSavePriorities} className="flex-1 sm:flex-none">
                <Save size={12} className="mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit} className="flex-1 sm:flex-none">
                <X size={12} className="mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {staff.priorities.map((priority) => {
                const IconComponent = getPriorityIcon(priority);
                return (
                  <Badge key={priority} variant="secondary" className="text-xs mr-1 flex items-center gap-1">
                    <IconComponent size={10} />
                    <span className="truncate max-w-[80px]">{getPriorityLabel(priority)}</span>
                  </Badge>
                );
              })}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingPriorities(true)}
              className="text-xs p-1 h-auto"
            >
              <Edit size={12} className="mr-1" />
              Edit
            </Button>
          </div>
        )}
      </TableCell>
      <TableCell className="py-4">
        <Badge variant={staff.status === 'active' ? 'default' : 'secondary'} className="text-xs">
          {staff.status}
        </Badge>
      </TableCell>
      <TableCell className="py-4 text-xs text-muted-foreground">
        {staff.createdAt}
      </TableCell>
      <TableCell className="py-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStatus(staff.id)}
            className="text-xs px-2 py-1 h-auto"
          >
            {staff.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemoveStaff(staff.id)}
            className="text-xs px-2 py-1 h-auto"
          >
            <Trash2 size={12} className="mr-1" />
            Remove
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default StaffRow;

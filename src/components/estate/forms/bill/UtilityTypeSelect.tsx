
import React from 'react';
import { Zap, Droplets, Wifi, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UtilityTypeSelectProps {
  onValueChange: (value: string) => void;
  defaultValue?: string;
}

const UtilityTypeSelect = ({ onValueChange, defaultValue = "electricity" }: UtilityTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="utilityType">Utility Type</Label>
      <Select onValueChange={onValueChange} defaultValue={defaultValue}>
        <SelectTrigger>
          <SelectValue placeholder="Select utility type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="electricity">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              Electricity
            </div>
          </SelectItem>
          <SelectItem value="water">
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-blue-500" />
              Water
            </div>
          </SelectItem>
          <SelectItem value="internet">
            <div className="flex items-center gap-2">
              <Wifi size={16} className="text-purple-500" />
              Internet
            </div>
          </SelectItem>
          <SelectItem value="waste">
            <div className="flex items-center gap-2">
              <Trash2 size={16} className="text-green-500" />
              Waste Management
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UtilityTypeSelect;

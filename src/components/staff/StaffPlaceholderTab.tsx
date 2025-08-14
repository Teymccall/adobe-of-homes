
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StaffPlaceholderTabProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const StaffPlaceholderTab = ({ title, description, icon: Icon }: StaffPlaceholderTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="text-center py-8 text-muted-foreground">
        <Icon size={48} className="mx-auto mb-4" />
        <p>{title} functionality will be available here.</p>
        <p className="text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default StaffPlaceholderTab;

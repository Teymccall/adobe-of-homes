
import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EstateUserDetailHeaderProps {
  estateName: string;
  estateManager: string;
  userId: string;
  onBack: () => void;
  onPrintReport: (reportType: string) => void;
}

const EstateUserDetailHeader = ({ 
  estateName, 
  estateManager, 
  userId, 
  onBack, 
  onPrintReport 
}: EstateUserDetailHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">{estateName}</h2>
        <p className="text-gray-600">Estate Manager: {estateManager}</p>
      </div>
      <TooltipProvider>
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft size={16} className="mr-2" />
                Back to Overview
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Return to Overview</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={() => onPrintReport(`estate-${userId}`)}>
                <Printer className="mr-2" size={16} />
                Print Estate Report
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print Complete Estate Report</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default EstateUserDetailHeader;

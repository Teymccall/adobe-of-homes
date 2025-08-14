
import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { HomeOwner } from '@/data/types';

interface PropertyVerificationProps {
  verifyingAgent: HomeOwner;
  verificationDate?: Date;
}

const PropertyVerification = ({ verifyingAgent, verificationDate }: PropertyVerificationProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-ghana-verified">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BadgeCheck size={20} className="text-ghana-verified" />
        Verified Property
      </h2>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border-2 border-ghana-verified">
          <AvatarImage src={verifyingAgent.profileImage} alt={verifyingAgent.name} />
          <AvatarFallback>{verifyingAgent.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-medium text-lg flex items-center gap-1">
                {verifyingAgent.name}
                {verifyingAgent.isVerified && <BadgeCheck size={16} className="text-ghana-verified" />}
              </h3>
              <p className="text-sm text-muted-foreground">{verifyingAgent.company || "Independent Home Owner"}</p>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <p>Verified on {format(verificationDate || new Date(), 'MMMM d, yyyy')}</p>
            <p className="mt-1 text-muted-foreground">
              This property has been physically inspected and verified by {verifyingAgent.name}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyVerification;

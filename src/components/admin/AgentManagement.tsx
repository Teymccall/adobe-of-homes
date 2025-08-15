
import React, { useState, useEffect } from 'react';
import { UserX, FileText, User, Mail, Phone, Briefcase, MapPin, Home, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { adminService } from '@/services/adminService';

interface VerifiedHomeOwner {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  location?: string;
  company?: string;
  bio?: string;
  yearsOfExperience?: number;
  profileImage?: string;
  averageRating?: number;
  properties?: any[];
  verifiedProperties?: any[];
  createdAt?: any;
  updatedAt?: any;
}

const AgentManagement = () => {
  const { toast } = useToast();
  const [agents, setAgents] = useState<VerifiedHomeOwner[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<VerifiedHomeOwner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getVerifiedAgents();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast({
          title: "Error",
          description: "Failed to load agents. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, [toast]);

  const viewAgent = (agent: VerifiedHomeOwner) => {
    setSelectedAgent(agent);
    setIsDialogOpen(true);
  };

  const confirmDelete = (agent: VerifiedHomeOwner) => {
    setSelectedAgent(agent);
    setIsDeleteDialogOpen(true);
  };

  const deleteAgent = (id: string) => {
    // In a real app, this would call an API to update the database
    setAgents(agents.filter(agent => agent.id !== id));
    toast({
      title: "Home Owner Removed",
      description: "The home owner has been removed from the system.",
      variant: "destructive"
    });
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      {agents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <User size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">No verified home owners</p>
          <p>When home owners are approved, they will appear here.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Home Owner</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Company</TableHead>
              <TableHead className="hidden lg:table-cell">Experience</TableHead>
              <TableHead className="hidden lg:table-cell">Properties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {agent.profileImage ? (
                        <img 
                          src={agent.profileImage} 
                          alt={agent.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600 font-semibold">
                          {agent.displayName?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p>{agent.displayName}</p>
                      <p className="md:hidden text-xs text-gray-500">{agent.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div>
                    <p className="font-medium">{agent.email}</p>
                    <p className="text-sm text-gray-500">{agent.phone || 'No phone'}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {agent.company || "Independent Home Owner"}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {agent.yearsOfExperience ? `${agent.yearsOfExperience} years` : 'Not specified'}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline">{agent.properties?.length || 0}</Badge>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => viewAgent(agent)}
                    className="mr-2"
                  >
                    View
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => confirmDelete(agent)}
                  >
                    <UserX size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Home Owner Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedAgent && (
          <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Home Owner Profile</DialogTitle>
              <DialogDescription>
                View detailed information about this home owner.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col lg:flex-row gap-6 py-4">
              {/* Profile Summary - Stack on mobile */}
              <div className="w-full lg:w-1/3 flex flex-col items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-ghana-primary mb-3 bg-gray-200 flex items-center justify-center">
                  {selectedAgent.profileImage ? (
                    <img 
                      src={selectedAgent.profileImage} 
                      alt={selectedAgent.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-semibold text-2xl md:text-4xl">
                      {selectedAgent.displayName?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-center">{selectedAgent.displayName}</h3>
                <p className="text-gray-500 text-sm md:text-base text-center">{selectedAgent.company || "Independent Home Owner"}</p>
                <div className="flex items-center mt-2">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className="text-sm md:text-base">{selectedAgent.averageRating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>

              {/* Detailed Information - Full width on mobile */}
              <div className="w-full lg:w-2/3 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Mail size={16} className="text-gray-600" />
                      Email
                    </p>
                    <p className="font-medium text-sm md:text-base break-all">{selectedAgent.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Phone size={16} className="text-gray-600" />
                      Phone
                    </p>
                    <p className="font-medium text-sm md:text-base">{selectedAgent.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Briefcase size={16} className="text-gray-600" />
                      Experience
                    </p>
                    <p className="font-medium text-sm md:text-base">{selectedAgent.yearsOfExperience ? `${selectedAgent.yearsOfExperience} years` : 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <MapPin size={16} className="text-gray-600" />
                      Location
                    </p>
                    <p className="font-medium text-sm md:text-base">{selectedAgent.location || 'Not specified'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <User size={16} className="text-gray-600" />
                    Bio
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">{selectedAgent.bio || 'No bio provided'}</p>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Home size={16} className="text-gray-600" />
                    Properties
                  </p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs md:text-sm">
                      {selectedAgent.properties?.length || 0} Total
                    </Badge>
                    <Badge variant="outline" className="text-xs md:text-sm">
                      {selectedAgent.verifiedProperties?.length || 0} Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="w-full sm:w-auto"
              >
                Close
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  if (selectedAgent) {
                    deleteAgent(selectedAgent.id);
                    setIsDialogOpen(false);
                  }
                }}
                className="w-full sm:w-auto"
              >
                <Trash2 size={16} className="mr-2" />
                Remove Home Owner
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Home Owner</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this home owner from the system? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                if (selectedAgent) {
                  deleteAgent(selectedAgent.id);
                }
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentManagement;

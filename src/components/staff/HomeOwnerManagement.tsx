
import React, { useState } from 'react';
import { UserPlus, User, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { HomeOwner } from '@/data/types';
import AddHomeOwnerDialog from './AddHomeOwnerDialog';

const HomeOwnerManagement = () => {
  const { toast } = useToast();
  const [homeOwners, setHomeOwners] = useState<HomeOwner[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleAddHomeOwner = (homeOwnerData: HomeOwner) => {
    setHomeOwners(prev => [...prev, homeOwnerData]);
    
    // Save to localStorage for persistence
    const existingHomeOwners = JSON.parse(localStorage.getItem('homeOwners') || '[]');
    const updatedHomeOwners = [...existingHomeOwners, homeOwnerData];
    localStorage.setItem('homeOwners', JSON.stringify(updatedHomeOwners));
  };

  const handleRemoveHomeOwner = (id: string) => {
    setHomeOwners(prev => prev.filter(ho => ho.id !== id));
    
    // Update localStorage
    const existingHomeOwners = JSON.parse(localStorage.getItem('homeOwners') || '[]');
    const updatedHomeOwners = existingHomeOwners.filter((ho: HomeOwner) => ho.id !== id);
    localStorage.setItem('homeOwners', JSON.stringify(updatedHomeOwners));
    
    toast({
      title: "Home Owner Removed",
      description: "The home owner has been removed from the system.",
      variant: "destructive"
    });
  };

  // Load home owners from localStorage on component mount
  React.useEffect(() => {
    const savedHomeOwners = JSON.parse(localStorage.getItem('homeOwners') || '[]');
    setHomeOwners(savedHomeOwners);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Home Owner Management</h3>
          <p className="text-sm text-muted-foreground">Add and manage home owners in the system</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <UserPlus size={16} />
          Add Home Owner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} />
            Registered Home Owners ({homeOwners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {homeOwners.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <User size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No home owners registered</p>
              <p>Click "Add Home Owner" to register the first home owner.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Home Owner</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeOwners.map((homeOwner) => (
                  <TableRow key={homeOwner.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-ghana-primary/10 flex items-center justify-center">
                          <User size={16} className="text-ghana-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{homeOwner.name}</p>
                          <p className="text-sm text-muted-foreground">{homeOwner.company || 'Independent'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{homeOwner.email}</p>
                        <p className="text-sm text-muted-foreground">{homeOwner.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{homeOwner.location}</p>
                        <p className="text-sm text-muted-foreground">{homeOwner.region}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{homeOwner.yearsOfExperience} years</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">Verified</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm">
                          <Eye size={14} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveHomeOwner(homeOwner.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddHomeOwnerDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddHomeOwner}
      />
    </div>
  );
};

export default HomeOwnerManagement;

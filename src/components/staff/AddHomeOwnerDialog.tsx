
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddHomeOwnerDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddHomeOwnerDialog = ({ open, onClose, onSubmit }: AddHomeOwnerDialogProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      bio: '',
      region: '',
      location: '',
      yearsOfExperience: '',
      idType: '',
      idNumber: ''
    }
  });

  const regions = [
    'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 
    'Northern', 'Upper East', 'Upper West', 'Volta', 'Brong Ahafo'
  ];

  const idTypes = ['Ghana Card', 'Passport', 'Voter ID', 'Driver\'s License'];

  const handleFormSubmit = (data: any) => {
    const homeOwnerData = {
      id: `ho_${Date.now()}`,
      ...data,
      yearsOfExperience: Number(data.yearsOfExperience),
      profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
      isVerified: true,
      properties: [],
      reviews: [],
      averageRating: 0,
      verifiedProperties: [],
      applicationStatus: 'approved' as const,
      applicationDate: new Date()
    };

    onSubmit(homeOwnerData);
    toast({
      title: "Home Owner Added",
      description: `${data.name} has been successfully added as a verified home owner.`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Home Owner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter full name"
              />
              {errors.name && <p className="text-sm text-red-500">{String(errors.name.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Enter email address"
              />
              {errors.email && <p className="text-sm text-red-500">{String(errors.email.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Phone is required' })}
                placeholder="+233 XX XXX XXXX"
              />
              {errors.phone && <p className="text-sm text-red-500">{String(errors.phone.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Select onValueChange={(value) => setValue('region', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location/City</Label>
              <Input
                id="location"
                {...register('location', { required: 'Location is required' })}
                placeholder="Enter city or area"
              />
              {errors.location && <p className="text-sm text-red-500">{String(errors.location.message)}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                {...register('yearsOfExperience', { required: 'Experience is required' })}
                placeholder="0"
                min="0"
              />
              {errors.yearsOfExperience && <p className="text-sm text-red-500">{String(errors.yearsOfExperience.message)}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="idType">ID Type</Label>
              <Select onValueChange={(value) => setValue('idType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
                <SelectContent>
                  {idTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input
              id="idNumber"
              {...register('idNumber', { required: 'ID number is required' })}
              placeholder="Enter ID number"
            />
            {errors.idNumber && <p className="text-sm text-red-500">{String(errors.idNumber.message)}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio/Description</Label>
            <Textarea
              id="bio"
              {...register('bio', { required: 'Bio is required' })}
              placeholder="Brief description about the home owner..."
              rows={3}
            />
            {errors.bio && <p className="text-sm text-red-500">{String(errors.bio.message)}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Home Owner</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHomeOwnerDialog;

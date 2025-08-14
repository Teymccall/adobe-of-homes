
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

interface ApartmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ApartmentForm = ({ open, onClose, onSubmit }: ApartmentFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      id: '',
      rent: '',
      bedrooms: '1',
      bathrooms: '1',
      area: '',
      floor: '',
      description: '',
      amenities: ''
    }
  });

  const handleFormSubmit = (data: any) => {
    onSubmit({
      ...data,
      rent: Number(data.rent),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area: Number(data.area),
      floor: Number(data.floor),
      status: 'vacant',
      tenant: null,
      lastPayment: null,
      phone: null
    });
    toast({
      title: "Apartment Added",
      description: `Apartment ${data.id} has been added successfully`,
    });
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Apartment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">Apartment ID</Label>
              <Input
                id="id"
                {...register('id', { required: 'Apartment ID is required' })}
                placeholder="e.g., A101, B205"
              />
              {errors.id && <p className="text-sm text-red-500">{errors.id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="rent">Monthly Rent (GH₵)</Label>
              <Input
                id="rent"
                type="number"
                {...register('rent', { required: 'Rent amount is required', min: 1 })}
                placeholder="2500"
              />
              {errors.rent && <p className="text-sm text-red-500">{errors.rent.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Select onValueChange={(value) => setValue('bedrooms', value)} defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Bedrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Select onValueChange={(value) => setValue('bathrooms', value)} defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Bathrooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                {...register('floor', { required: 'Floor is required', min: 0 })}
                placeholder="1"
              />
              {errors.floor && <p className="text-sm text-red-500">{errors.floor.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">Area (sq ft)</Label>
            <Input
              id="area"
              type="number"
              {...register('area', { required: 'Area is required', min: 1 })}
              placeholder="850"
            />
            {errors.area && <p className="text-sm text-red-500">{errors.area.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <Input
              id="amenities"
              {...register('amenities')}
              placeholder="AC, Balcony, Parking, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Additional details about the apartment..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Apartment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApartmentForm;

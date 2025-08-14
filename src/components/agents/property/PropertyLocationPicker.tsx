
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { useMaps } from '@/context/MapsContext';
import MapboxPicker from '@/components/maps/MapboxPicker';

interface PropertyLocationPickerProps {
  initialLocation: { lat: number; lng: number };
  onLocationSelected: (location: { lat: number; lng: number }) => void;
}

const PropertyLocationPicker = ({ initialLocation, onLocationSelected }: PropertyLocationPickerProps) => {
  const { mapboxAccessToken } = useMaps();

  return (
    <div>
      <FormLabel>Map Location</FormLabel>
      <MapboxPicker 
        accessToken={mapboxAccessToken} 
        initialLocation={initialLocation}
        onLocationSelected={onLocationSelected}
      />
    </div>
  );
};

export default PropertyLocationPicker;

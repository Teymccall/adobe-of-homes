import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxPickerProps {
  accessToken: string;
  initialLocation?: { lat: number; lng: number };
  onLocationSelected: (location: { lat: number; lng: number }) => void;
}

const MapboxPicker = ({ accessToken, initialLocation, onLocationSelected }: MapboxPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || { lat: 5.6037, lng: -0.1870 } // Default to Accra, Ghana
  );

  useEffect(() => {
    if (!accessToken || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = accessToken;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [currentLocation?.lng || -0.1870, currentLocation?.lat || 5.6037],
      zoom: 15
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker if we have an initial location
    if (currentLocation) {
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([currentLocation.lng, currentLocation.lat])
        .addTo(map.current);

      // Update location when marker is dragged
      marker.current.on('dragend', () => {
        const position = marker.current?.getLngLat();
        if (position) {
          const newLocation = { lat: position.lat, lng: position.lng };
          setCurrentLocation(newLocation);
          onLocationSelected(newLocation);
        }
      });
    }

    // Add click event to map
    map.current.on('click', (e) => {
      const clickedLocation = { lat: e.lngLat.lat, lng: e.lngLat.lng };
      setCurrentLocation(clickedLocation);
      
      // Update marker position or create new marker
      if (marker.current) {
        marker.current.setLngLat([clickedLocation.lng, clickedLocation.lat]);
      } else {
        marker.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([clickedLocation.lng, clickedLocation.lat])
          .addTo(map.current);

        // Update location when marker is dragged
        marker.current.on('dragend', () => {
          const position = marker.current?.getLngLat();
          if (position) {
            const newPosition = { lat: position.lat, lng: position.lng };
            setCurrentLocation(newPosition);
            onLocationSelected(newPosition);
          }
        });
      }
      
      onLocationSelected(clickedLocation);
    });

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [accessToken, onLocationSelected]);

  // Use current device location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          
          if (map.current) {
            map.current.flyTo({
              center: [newLocation.lng, newLocation.lat],
              zoom: 15
            });
          }
          
          if (marker.current) {
            marker.current.setLngLat([newLocation.lng, newLocation.lat]);
          } else {
            marker.current = new mapboxgl.Marker({ draggable: true })
              .setLngLat([newLocation.lng, newLocation.lat])
              .addTo(map.current!);
          }
          
          onLocationSelected(newLocation);
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Property Location</h3>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={useCurrentLocation}
          className="flex items-center gap-1"
        >
          <MapPin size={14} />
          Use My Location
        </Button>
      </div>
      
      {!accessToken ? (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
          <p className="text-sm">Please enter a Mapbox access token to enable the map.</p>
        </div>
      ) : (
        <div 
          ref={mapContainer} 
          className="w-full h-[300px] rounded-md border border-gray-200 shadow-sm"
          style={{ borderRadius: '0.375rem' }}
        />
      )}
      
      {currentLocation && (
        <div className="text-xs text-muted-foreground">
          <p>Selected coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
        </div>
      )}
    </div>
  );
};

export default MapboxPicker; 
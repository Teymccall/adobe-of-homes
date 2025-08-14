
import React, { useRef, useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoogleMapPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelected: (location: { lat: number; lng: number }) => void;
  apiKey: string;
}

const GoogleMapPicker = ({ initialLocation, onLocationSelected, apiKey }: GoogleMapPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || { lat: 5.6037, lng: -0.1870 } // Default to Accra, Ghana
  );

  // Load Google Maps script
  useEffect(() => {
    if (!apiKey) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    // Check if script already exists
    if (!document.getElementById('google-maps-script')) {
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      initMap();
    }

    return () => {
      if (document.getElementById('google-maps-script') === script) {
        document.head.removeChild(script);
      }
    };
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    const mapOptions = {
      center: currentLocation || { lat: 5.6037, lng: -0.1870 }, // Accra, Ghana
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: false,
    };

    const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
    setMap(newMap);

    // Add marker if we have an initial location
    if (currentLocation) {
      const newMarker = new window.google.maps.Marker({
        position: currentLocation,
        map: newMap,
        draggable: true
      });
      
      setMarker(newMarker);
      
      // Update location when marker is dragged
      newMarker.addListener('dragend', () => {
        const position = newMarker.getPosition();
        if (position) {
          const newLocation = { lat: position.lat(), lng: position.lng() };
          setCurrentLocation(newLocation);
          onLocationSelected(newLocation);
        }
      });
    }

    // Add click event to map
    newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
      const clickedLocation = e.latLng;
      if (clickedLocation) {
        const newLocation = { lat: clickedLocation.lat(), lng: clickedLocation.lng() };
        setCurrentLocation(newLocation);
        
        // Update marker position or create new marker
        if (marker) {
          marker.setPosition(clickedLocation);
        } else {
          const newMarker = new window.google.maps.Marker({
            position: clickedLocation,
            map: newMap,
            draggable: true
          });
          
          setMarker(newMarker);
          
          // Update location when marker is dragged
          newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            if (position) {
              const newPosition = { lat: position.lat(), lng: position.lng() };
              setCurrentLocation(newPosition);
              onLocationSelected(newPosition);
            }
          });
        }
        
        onLocationSelected(newLocation);
      }
    });
  };

  // Use current device location
  const useCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCurrentLocation(newLocation);
          
          if (map) {
            map.setCenter(newLocation);
            
            if (marker) {
              marker.setPosition(newLocation);
            } else {
              const newMarker = new window.google.maps.Marker({
                position: newLocation,
                map: map,
                draggable: true
              });
              
              setMarker(newMarker);
              
              // Update location when marker is dragged
              newMarker.addListener('dragend', () => {
                const position = newMarker.getPosition();
                if (position) {
                  const newPosition = { lat: position.lat(), lng: position.lng() };
                  setCurrentLocation(newPosition);
                  onLocationSelected(newPosition);
                }
              });
            }
            
            onLocationSelected(newLocation);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
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
      
      {!apiKey ? (
        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md">
          <p className="text-sm">Please enter a Google Maps API key to enable the map.</p>
        </div>
      ) : (
        <div 
          ref={mapRef} 
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

export default GoogleMapPicker;


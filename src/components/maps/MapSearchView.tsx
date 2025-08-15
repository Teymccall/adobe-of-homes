import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/data/types';
import { useMaps } from '@/context/MapsContext';
import { Button } from '@/components/ui/button';

interface MapSearchViewProps {
  properties: Property[];
  onBoundsChange?: (bounds: mapboxgl.LngLatBoundsLike) => void;
}

const MapSearchView: React.FC<MapSearchViewProps> = ({ properties, onBoundsChange }) => {
  const { mapboxAccessToken } = useMaps();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapboxAccessToken || !mapContainer.current) return;
    mapboxgl.accessToken = mapboxAccessToken;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-0.1870, 5.6037],
      zoom: 10
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('moveend', () => {
      if (onBoundsChange) onBoundsChange(map.getBounds());
    });

    return () => map.remove();
  }, [mapboxAccessToken, onBoundsChange]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers (simple approach)
    const existing = document.querySelectorAll('.property-marker');
    existing.forEach(el => el.remove());

    properties.forEach((p) => {
      const el = document.createElement('div');
      el.className = 'property-marker';
      el.style.width = '12px';
      el.style.height = '12px';
      el.style.borderRadius = '9999px';
      el.style.background = p.isVerified ? '#10b981' : '#3b82f6';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.2)';

      new mapboxgl.Marker({ element: el })
        .setLngLat([p.mapLocation?.lng || 0, p.mapLocation?.lat || 0])
        .setPopup(new mapboxgl.Popup({ offset: 12 }).setHTML(`
          <div style="min-width:180px">
            <div style="font-weight:600;margin-bottom:4px">${p.title}</div>
            <div>GHS ${p.price?.toLocaleString?.() || p.price}</div>
            <div style="font-size:12px;color:#666">${p.location || ''}</div>
          </div>
        `))
        .addTo(map);
    });

    // Fit to markers if we have valid coords
    const coords = properties
      .map(p => p.mapLocation)
      .filter(Boolean) as Array<{ lat: number; lng: number }>;
    if (coords.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coords.forEach(c => bounds.extend([c.lng, c.lat]));
      map.fitBounds(bounds, { padding: 40, maxZoom: 14 });
    }
  }, [properties]);

  if (!mapboxAccessToken) {
    return (
      <div className="p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
        Add a Mapbox access token to use the map.
      </div>
    );
  }

  return (
    <div className="w-full h-[360px] rounded-md border border-gray-200" ref={mapContainer} />
  );
};

export default MapSearchView;




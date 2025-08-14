
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MapsContextType {
  mapboxAccessToken: string;
  setMapboxAccessToken: (token: string) => void;
}

const MapsContext = createContext<MapsContextType | undefined>(undefined);

export const MapsProvider = ({ children }: { children: ReactNode }) => {
  // Pre-populate with the user's Mapbox access token for testing
  const [mapboxAccessToken, setMapboxAccessToken] = useState<string>('pk.eyJ1IjoibWNjYWxsbCIsImEiOiJjbWRydnA3bzAwaTVoMmtzZmU3MjFobzM1In0.Qu5vxQwjlON-kg_OSdcGmQ');

  return (
    <MapsContext.Provider value={{ mapboxAccessToken, setMapboxAccessToken }}>
      {children}
    </MapsContext.Provider>
  );
};

export const useMaps = () => {
  const context = useContext(MapsContext);
  if (context === undefined) {
    throw new Error('useMaps must be used within a MapsProvider');
  }
  return context;
};

import React, { useEffect, useState } from 'react';
import { propertyService } from '@/services/propertyService';
import { Property } from '@/data/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminFeaturedPropertyList: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    try {
      setIsLoading(true);
      const items = await propertyService.getFeaturedProperties(24);
      setProperties(items);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggleFeatured = async (id: string, current: boolean) => {
    await propertyService.updateProperty(id, { isFeatured: !current } as any);
    await load();
  };

  return (
    <div>
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : properties.length === 0 ? (
        <p className="text-sm text-gray-500">No featured properties yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map(p => (
            <div key={p.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{p.title}</h4>
                {p.isVerified && <Badge variant="secondary">Verified</Badge>}
              </div>
              <p className="text-sm text-gray-600">{p.location}</p>
              <p className="text-sm text-gray-800 mt-1">GHS {p.price.toLocaleString()}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant={p.isFeatured ? 'outline' : 'default'} onClick={() => toggleFeatured(p.id, !!p.isFeatured)}>
                  {p.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFeaturedPropertyList;




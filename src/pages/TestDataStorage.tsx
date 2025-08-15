import React, { useState } from 'react';
import { addSampleProperties } from '@/scripts/addSampleProperties';
import { propertyService } from '@/services/propertyService';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Home, 
  Users, 
  Plus, 
  CheckCircle, 
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

const TestDataStorage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  const [homeOwners, setHomeOwners] = useState<any[]>([]);
  const [showData, setShowData] = useState(false);

  const handleAddSampleProperties = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      await addSampleProperties();
      setMessage('✅ Sample properties added successfully! Check the Search page now.');
      
      // Refresh the properties list
      await loadData();
    } catch (error) {
      setMessage(`❌ Error adding properties: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propertiesData, homeOwnersData] = await Promise.all([
        propertyService.getAllProperties(),
        authService.getVerifiedHomeOwners()
      ]);
      
      setProperties(propertiesData || []);
      setHomeOwners(homeOwnersData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage(`❌ Error loading data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadData = async () => {
    await loadData();
    setShowData(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            <Database className="inline-block mr-3 text-blue-600" size={40} />
            Data Storage Testing
          </h1>
          <p className="text-xl text-slate-600">
            Test Firebase data storage and Cloudinary image uploads
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Plus className="mr-2 h-5 w-5 text-green-600" />
                Add Sample Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Add sample properties to test the Search page functionality
              </p>
              <Button 
                onClick={handleAddSampleProperties}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Sample Properties
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <RefreshCw className="mr-2 h-5 w-5 text-blue-600" />
                Load Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Load current data from Firebase to see what's stored
              </p>
              <Button 
                onClick={handleLoadData}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Load Current Data
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-800">
                <Eye className="mr-2 h-5 w-5 text-purple-600" />
                View Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Toggle to show/hide the loaded data
              </p>
              <Button 
                onClick={() => setShowData(!showData)}
                variant="outline"
                className="w-full border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                {showData ? 'Hide Data' : 'Show Data'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Status Message */}
        {message && (
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardContent className="p-6">
              <div className={`flex items-center ${
                message.includes('✅') ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.includes('✅') ? (
                  <CheckCircle className="mr-3 h-5 w-5" />
                ) : (
                  <AlertCircle className="mr-3 h-5 w-5" />
                )}
                <span className="font-medium">{message}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Data Display */}
        {showData && (
          <div className="space-y-6">
            {/* Properties */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Home className="mr-2 h-5 w-5 text-blue-600" />
                  Properties ({properties.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property, index) => (
                      <div key={property.id || index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-slate-800 truncate">
                            {property.title}
                          </h4>
                          <Badge variant={property.isVerified ? "default" : "secondary"}>
                            {property.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{property.location}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-700">${property.price}</span>
                          <span className="text-slate-500">
                            {property.bedrooms} bed, {property.bathrooms} bath
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">
                    No properties found in the database
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Home Owners */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-800">
                  <Users className="mr-2 h-5 w-5 text-green-600" />
                  Home Owners ({homeOwners.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {homeOwners.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {homeOwners.map((owner, index) => (
                      <div key={owner.uid || index} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm text-slate-800 truncate">
                            {owner.name || owner.displayName}
                          </h4>
                          <Badge variant={owner.isVerified ? "default" : "secondary"}>
                            {owner.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{owner.email}</p>
                        <div className="text-sm text-slate-700">
                          {owner.properties?.length || 0} properties
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-center py-8">
                    No home owners found in the database
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg mt-8">
          <CardHeader>
            <CardTitle className="text-slate-800">How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-slate-700">
              <p><strong>1.</strong> Click "Add Sample Properties" to populate the database with test data</p>
              <p><strong>2.</strong> Go to the <a href="/search" className="text-blue-600 hover:underline">Search page</a> to see the properties displayed publicly</p>
              <p><strong>3.</strong> Use "Load Data" to see what's currently stored in Firebase</p>
              <p><strong>4.</strong> Check the browser console for detailed logging and debugging information</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestDataStorage;

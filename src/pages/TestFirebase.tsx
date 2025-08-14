import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import FirebaseLogin from '@/components/auth/FirebaseLogin';
import CloudinaryUpload from '@/components/upload/CloudinaryUpload';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MultiSelect, MultiSelectOption } from '@/components/ui/multi-select';
import { Rating, RatingDisplay, RatingInput } from '@/components/ui/rating';
import { PriceRangeSlider } from '@/components/ui/price-range-slider';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudinaryUploadResult } from '@/services/cloudinaryService';
import { getOptimizedImageUrl } from '@/lib/cloudinary';
import { DateRange } from 'react-day-picker';
import { Wifi, Car, Shield, Tv, Utensils, Waves } from 'lucide-react';

const TestFirebase = () => {
  const { user, userProfile } = useAuth();
  const { data: properties, isLoading, error } = useFeaturedProperties(3);
  const [uploadedImages, setUploadedImages] = useState<CloudinaryUploadResult[]>([]);
  
  // State for new UI components
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [rating, setRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);

  // Sample amenities options
  const amenityOptions: MultiSelectOption[] = [
    { label: "Wi-Fi", value: "wifi", icon: Wifi },
    { label: "Parking", value: "parking", icon: Car },
    { label: "Security", value: "security", icon: Shield },
    { label: "Cable TV", value: "cable", icon: Tv },
    { label: "Kitchen", value: "kitchen", icon: Utensils },
    { label: "Swimming Pool", value: "pool", icon: Waves },
  ];

  const handleUploadComplete = (results: CloudinaryUploadResult[]) => {
    setUploadedImages(prev => [...prev, ...results]);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Firebase & Cloudinary Integration Test</h1>
          <p className="text-gray-600">Test Firebase Authentication, Firestore, and Cloudinary uploads</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Authentication Test</h2>
            <FirebaseLogin 
              role="home_owner" 
              title="Test Firebase Auth"
              description="Test signing up and signing in with Firebase"
            />
          </div>

          {/* Firestore Data Test */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Firestore Data Test</h2>
            <Card>
              <CardHeader>
                <CardTitle>Featured Properties</CardTitle>
                <CardDescription>Testing property data from Firestore</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2">Loading properties...</p>
                  </div>
                )}
                
                {error && (
                  <div className="text-red-500 py-4">
                    <p>Error loading properties: {error.message}</p>
                  </div>
                )}
                
                {properties && properties.length > 0 ? (
                  <div className="space-y-3">
                    {properties.map((property) => (
                      <div key={property.id} className="border rounded p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{property.title}</h4>
                            <p className="text-sm text-gray-600">{property.location}</p>
                            <p className="text-green-600 font-bold">₵{property.price.toLocaleString()}</p>
                          </div>
                          <div className="flex gap-1">
                            {property.isVerified && <Badge variant="default">Verified</Badge>}
                            <Badge variant="outline">{property.propertyType}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : !isLoading && !error ? (
                  <div className="text-center py-4 text-gray-500">
                    <p>No properties found.</p>
                    <p className="text-sm mt-2">
                      Properties will appear here when added to Firestore.
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Cloudinary Upload Test */}
        <Card>
          <CardHeader>
            <CardTitle>Cloudinary Upload Test</CardTitle>
            <CardDescription>Test image and document uploads to Cloudinary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <h4 className="font-semibold mb-3">Image Upload</h4>
                <CloudinaryUpload
                  accept="image/*"
                  multiple={true}
                  maxFiles={5}
                  folder="properties"
                  onUploadComplete={handleUploadComplete}
                />
              </div>

              {/* Document Upload */}
              <div>
                <h4 className="font-semibold mb-3">Document Upload</h4>
                <CloudinaryUpload
                  accept="image/*,.pdf"
                  multiple={false}
                  maxFiles={1}
                  folder="documents"
                  onUploadComplete={handleUploadComplete}
                />
              </div>
            </div>

            {/* Upload Results Gallery */}
            {uploadedImages.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3">Uploaded Files ({uploadedImages.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedImages.map((result, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      {result.resourceType === 'image' ? (
                        <div className="aspect-square">
                          <img
                            src={getOptimizedImageUrl(result.publicId, { width: 200, height: 200, crop: 'fill' })}
                            alt={result.originalFilename}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          <div className="text-center">
                            <Badge variant="outline">{result.format.toUpperCase()}</Badge>
                            <p className="text-xs mt-1 truncate px-2">{result.originalFilename}</p>
                          </div>
                        </div>
                      )}
                      <div className="p-2">
                        <p className="text-xs font-medium truncate">{result.originalFilename}</p>
                        <p className="text-xs text-gray-500">{result.publicId}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(result.bytes / 1024)}KB
                          </Badge>
                          {result.width && result.height && (
                            <Badge variant="outline" className="text-xs">
                              {result.width}×{result.height}
                            </Badge>
                          )}
                        </div>
                        <a
                          href={result.secureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline block mt-1"
                        >
                          View Original
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New shadcn UI Components Test */}
        <Card>
          <CardHeader>
            <CardTitle>Custom shadcn UI Components</CardTitle>
            <CardDescription>Test our custom components for the real estate platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Date Range Picker */}
            <div>
              <h4 className="font-semibold mb-3">Date Range Picker</h4>
              <p className="text-sm text-gray-600 mb-3">Select availability dates or move-in period</p>
              <DateRangePicker
                value={dateRange}
                onChange={setDateRange}
                placeholder="Select availability dates"
              />
              {dateRange?.from && (
                <p className="text-sm text-green-600 mt-2">
                  Selected: {dateRange.from.toLocaleDateString()} 
                  {dateRange.to && ` - ${dateRange.to.toLocaleDateString()}`}
                </p>
              )}
            </div>

            {/* Multi Select for Amenities */}
            <div>
              <h4 className="font-semibold mb-3">Multi-Select Amenities</h4>
              <p className="text-sm text-gray-600 mb-3">Select property features and amenities</p>
              <MultiSelect
                options={amenityOptions}
                value={selectedAmenities}
                onChange={setSelectedAmenities}
                placeholder="Select amenities..."
                maxCount={3}
              />
              {selectedAmenities.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">
                    Selected: {selectedAmenities.join(', ')}
                  </p>
                </div>
              )}
            </div>

            {/* Rating Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Rating Input</h4>
                <p className="text-sm text-gray-600 mb-3">Rate your experience</p>
                <RatingInput
                  value={rating}
                  onChange={setRating}
                  size="lg"
                />
                <p className="text-sm text-green-600 mt-2">Your rating: {rating}/5</p>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Rating Display</h4>
                <p className="text-sm text-gray-600 mb-3">Property ratings display</p>
                <div className="space-y-2">
                  <RatingDisplay value={4.5} showValue showCount count={127} size="md" />
                  <RatingDisplay value={3.8} showValue showCount count={45} size="sm" />
                  <RatingDisplay value={5.0} showValue showCount count={234} size="lg" />
                </div>
              </div>
            </div>

            {/* Price Range Slider */}
            <div>
              <h4 className="font-semibold mb-3">Price Range Slider</h4>
              <p className="text-sm text-gray-600 mb-3">Filter properties by price range</p>
              <PriceRangeSlider
                min={0}
                max={10000}
                step={100}
                value={priceRange}
                onChange={setPriceRange}
                currency="₵"
                label="Monthly Rent Range"
                showInputs={true}
              />
              <p className="text-sm text-green-600 mt-2">
                Range: ₵{priceRange[0].toLocaleString()} - ₵{priceRange[1].toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Status */}
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Current User Status</CardTitle>
              <CardDescription>Your current authentication and profile status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Firebase Auth</h4>
                  <p><strong>UID:</strong> {user.uid}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
                </div>
                {userProfile && (
                  <div>
                    <h4 className="font-semibold mb-2">User Profile</h4>
                    <p><strong>Name:</strong> {userProfile.displayName}</p>
                    <p><strong>Role:</strong> {userProfile.role}</p>
                    <p><strong>Status:</strong> 
                      <Badge 
                        variant={userProfile.status === 'approved' ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {userProfile.status}
                      </Badge>
                    </p>
                    <p><strong>Verified:</strong> {userProfile.isVerified ? 'Yes' : 'No'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-semibold">1. Authentication Test:</h4>
              <p className="text-sm text-gray-600">
                - Try signing up with a new email and password
                <br />
                - Try signing in with existing credentials
                <br />
                - Check that user profile is created in Firestore
              </p>
            </div>
            <div>
              <h4 className="font-semibold">2. Firestore Test:</h4>
              <p className="text-sm text-gray-600">
                - The properties section will show data from Firebase
                <br />
                - Initially it will be empty until you add test data
                <br />
                - You can add test properties through the Firebase console
              </p>
            </div>
            <div>
              <h4 className="font-semibold">3. Cloudinary Test:</h4>
              <p className="text-sm text-gray-600">
                - Try uploading images and documents
                <br />
                - Check the upload progress and results
                <br />
                - View the generated optimized image URLs
              </p>
            </div>
            <div>
              <h4 className="font-semibold">4. Custom UI Components:</h4>
              <p className="text-sm text-gray-600">
                - Test the date range picker for availability
                <br />
                - Try the multi-select for amenities/features
                <br />
                - Use the rating components for reviews
                <br />
                - Adjust the price range slider for filtering
              </p>
            </div>
            <div>
              <h4 className="font-semibold">5. Super Admin Setup:</h4>
              <p className="text-sm text-gray-600">
                - Visit <strong>/super-admin-login</strong> to create your admin account
                <br />
                - Click "Sign Up as Super Admin" to register
                <br />
                - Your account will be stored in Firebase automatically
                <br />
                - Access the full admin dashboard after signup
              </p>
            </div>
            <div>
              <h4 className="font-semibold">6. Next Steps:</h4>
              <p className="text-sm text-gray-600">
                - Set up Cloudinary upload preset in your account
                <br />
                - Configure Firestore security rules
                <br />
                - Add sample data to test the complete flow
                <br />
                - Update existing pages to use Firebase & Cloudinary
                <br />
                - Integrate new UI components into property forms
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestFirebase; 
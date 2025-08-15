import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cloudinaryService } from '@/services/cloudinaryService';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HomeOwnerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  idType: string;
  idNumber: string;
  about: string;
  profileImageUrl?: string;
  idImageUrl?: string;
  profileImagePublicId?: string;
  idImagePublicId?: string;
  applicantId: string;
  status: string;
  submittedDate: string;
  priority: string;
  reviewedBy: string | null;
  reviewNotes: string | null;
  lastUpdated: string;
  cloudinaryData?: {
    profileImage: {
      url: string;
      publicId: string;
    };
    idImage: {
      url: string;
      publicId: string;
    };
  };
}

const TestDataStorage = () => {
  const [applications, setApplications] = useState<HomeOwnerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [testImage, setTestImage] = useState<File | null>(null);
  const [uploadResult, setUploadResult] = useState<any>(null);

  // Fetch applications from Firebase
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'homeOwnerApplications'),
        orderBy('submittedDate', 'desc'),
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      const apps: HomeOwnerApplication[] = [];
      
      querySnapshot.forEach((doc) => {
        apps.push({
          id: doc.id,
          ...doc.data()
        } as HomeOwnerApplication);
      });
      
      setApplications(apps);
      console.log('Fetched applications:', apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Test Cloudinary upload
  const testCloudinaryUpload = async () => {
    if (!testImage) {
      alert('Please select an image first');
      return;
    }

    try {
      setLoading(true);
      const result = await cloudinaryService.uploadFile(testImage, {
        folder: 'test',
        resourceType: 'image',
        quality: 'auto',
        format: 'auto'
      });
      
      setUploadResult(result);
      console.log('Cloudinary upload result:', result);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Data Storage Test</h1>
            <p className="text-gray-600">Test Firebase data storage and Cloudinary image uploads</p>
          </div>

          {/* Cloudinary Test Section */}
          <Card>
            <CardHeader>
              <CardTitle>Test Cloudinary Upload</CardTitle>
              <CardDescription>Upload a test image to verify Cloudinary integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTestImage(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-ghana-primary file:text-white hover:file:bg-ghana-primary/90"
                />
              </div>
              <Button 
                onClick={testCloudinaryUpload} 
                disabled={!testImage || loading}
                className="bg-ghana-primary hover:bg-ghana-primary/90"
              >
                {loading ? 'Uploading...' : 'Test Upload to Cloudinary'}
              </Button>
              
              {uploadResult && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Upload Successful!</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Public ID:</strong> {uploadResult.publicId}</p>
                    <p><strong>URL:</strong> <a href={uploadResult.secureUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{uploadResult.secureUrl}</a></p>
                    <p><strong>Size:</strong> {uploadResult.bytes} bytes</p>
                    <p><strong>Format:</strong> {uploadResult.format}</p>
                  </div>
                  {uploadResult.secureUrl && (
                    <div className="mt-3">
                      <img 
                        src={uploadResult.secureUrl} 
                        alt="Uploaded test image" 
                        className="max-w-xs rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Firebase Data Section */}
          <Card>
            <CardHeader>
              <CardTitle>Firebase Data Verification</CardTitle>
              <CardDescription>View stored applications and verify data integrity</CardDescription>
              <Button onClick={fetchApplications} disabled={loading} variant="outline">
                Refresh Data
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ghana-primary mx-auto"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No applications found. Submit an application first to see data here.
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{app.name}</h3>
                          <p className="text-gray-600">{app.email}</p>
                          <p className="text-sm text-gray-500">{app.phone} • {app.location}, {app.region}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                            {app.status}
                          </Badge>
                          <Badge variant="outline">{app.priority}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>ID Type:</strong> {app.idType}</p>
                          <p><strong>ID Number:</strong> {app.idNumber}</p>
                          <p><strong>About:</strong> {app.about.substring(0, 100)}...</p>
                        </div>
                        <div>
                          <p><strong>Submitted:</strong> {new Date(app.submittedDate).toLocaleDateString()}</p>
                          <p><strong>Last Updated:</strong> {new Date(app.lastUpdated).toLocaleDateString()}</p>
                          <p><strong>Applicant ID:</strong> {app.applicantId}</p>
                        </div>
                      </div>

                      {/* Image URLs */}
                      <div className="border-t pt-3">
                        <h4 className="font-medium mb-2">Images:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {app.profileImageUrl && (
                            <div>
                              <p className="text-sm font-medium mb-1">Profile Image:</p>
                              <a 
                                href={app.profileImageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm break-all"
                              >
                                {app.profileImageUrl}
                              </a>
                              {app.profileImagePublicId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Public ID: {app.profileImagePublicId}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {app.idImageUrl && (
                            <div>
                              <p className="text-sm font-medium mb-1">ID Image:</p>
                              <a 
                                href={app.idImageUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm break-all"
                              >
                                {app.idImageUrl}
                              </a>
                              {app.idImagePublicId && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Public ID: {app.idImagePublicId}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Cloudinary Metadata */}
                      {app.cloudinaryData && (
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Cloudinary Metadata:</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                            {JSON.stringify(app.cloudinaryData, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TestDataStorage;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, Building, Search, FileText, Shield } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import StarRating from '@/components/reviews/StarRating';
import TenantSearch from '@/components/admin/TenantSearch';
import TenantReportForm from '@/components/estate/forms/TenantReportForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TenantReport } from '@/data/types';
import { authService, UserProfile } from '@/services/authService';

const HomeOwnersPage = () => {
  const [homeOwners, setHomeOwners] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showTenantSearch, setShowTenantSearch] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHomeOwners = async () => {
      try {
        setIsLoading(true);
        const verifiedHomeOwners = await authService.getVerifiedHomeOwners();
        setHomeOwners(verifiedHomeOwners);
      } catch (error) {
        console.error('Error fetching home owners:', error);
        toast({
          title: "Error",
          description: "Failed to load home owners. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeOwners();
  }, [toast]);

  const handleReportSubmit = (reportData: Partial<TenantReport>) => {
    console.log('Home owner tenant report submitted:', reportData);
    toast({
      title: "Report Submitted",
      description: "Your tenant report has been submitted successfully.",
    });
  };

  const handleSearchReports = () => {
    setShowTenantSearch(true);
    toast({
      title: "Tenant Search",
      description: "Search for tenant reports to make informed decisions.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Property Home Owners</h1>
        </div>
        
        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directory">Home Owners Directory</TabsTrigger>
            <TabsTrigger value="tenant-search">Tenant Search</TabsTrigger>
            <TabsTrigger value="reports">My Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="mt-6">
            {/* Quick Search Card */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search size={20} />
                  Quick Tenant Report Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Search for tenant reports to help make informed decisions about potential tenants.
                </p>
                <Button onClick={handleSearchReports} className="w-full sm:w-auto">
                  <Search className="mr-2" size={16} />
                  Search Tenant Reports
                </Button>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeOwners.map((homeOwner) => (
                  <Link
                    to={`/home-owners/${homeOwner.uid}`}
                    key={homeOwner.uid}
                    className="bg-white rounded-lg shadow hover:shadow-md transition-all overflow-hidden"
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-2xl font-bold">
                        {homeOwner.displayName?.charAt(0) || 'H'}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-lg">{homeOwner.displayName}</h3>
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-green-600" />
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        </div>
                      </div>
                      
                      {homeOwner.company && (
                        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                          <Building size={14} />
                          <span>{homeOwner.company}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                        <MapPin size={14} />
                        <span>{homeOwner.location || 'Location not specified'}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <StarRating rating={4.5} size={16} />
                          <span className="text-sm">(Verified)</span>
                        </div>
                        
                        <span className="text-sm text-ghana-primary font-medium">
                          {homeOwner.yearsOfExperience || 0} years exp.
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {!isLoading && homeOwners.length === 0 && (
              <div className="text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No verified home owners found</h3>
                <p className="text-gray-600">
                  There are currently no verified home owners in the system.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tenant-search" className="mt-6">
            <TenantSearch userType="home_owner" />
          </TabsContent>
          
          <TabsContent value="reports" className="mt-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">My Tenant Reports</h2>
                  <p className="text-muted-foreground mt-1">
                    Submit and manage reports about tenants
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSearchReports}>
                    <Search className="mr-2" size={16} />
                    Search Reports
                  </Button>
                  <Button onClick={() => setShowReportForm(true)}>
                    <FileText className="mr-2" size={16} />
                    Add New Report
                  </Button>
                </div>
              </div>
              
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    Submit reports about tenants to help other home owners and estate managers make informed decisions.
                    Use the search function to find existing reports about potential tenants.
                  </p>
                </CardContent>
              </Card>
              
              <TenantReportForm
                open={showReportForm}
                onClose={() => setShowReportForm(false)}
                onSubmit={handleReportSubmit}
                reporterType="home_owner"
                reporterName="Home Owner"
                reporterId="HO001"
              />

              {showTenantSearch && (
                <div className="mt-6">
                  <TenantSearch userType="home_owner" />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HomeOwnersPage;

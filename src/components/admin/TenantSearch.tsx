
import React, { useState } from 'react';
import { Search, FileText, Calendar, User, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TenantReport } from '@/data/types';
import { adminService } from '@/services/adminService';

interface TenantSearchProps {
  userType: 'super_admin' | 'home_owner';
}



const TenantSearch = ({ userType }: TenantSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TenantReport[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a tenant name to search",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const results = await adminService.searchTenantReports(searchTerm);
      
      // Transform the results to match TenantReport interface
      const transformedResults = results.map(report => ({
        id: report.id,
        tenantName: report.tenantName || 'Unknown',
        title: report.title || 'No Title',
        description: report.description || '',
        reportType: report.reportType || 'neutral',
        reporterType: report.reporterType || 'estate_manager',
        reporterName: report.reporterName || 'Unknown',
        createdAt: report.createdAt ? new Date(report.createdAt.toDate()) : new Date(),
        propertyId: report.propertyId || null,
        tags: report.tags || []
      }));
      
      setSearchResults(transformedResults);
      
      toast({
        title: "Search Complete",
        description: `Found ${transformedResults.length} report(s) for "${searchTerm}"`,
      });
    } catch (error) {
      console.error('Error searching tenant reports:', error);
      toast({
        title: "Search Error",
        description: "Failed to search tenant reports. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getReportTypeBadge = (type: string) => {
    switch (type) {
      case 'positive':
        return <Badge className="bg-green-500">Positive</Badge>;
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>;
      case 'neutral':
        return <Badge variant="secondary">Neutral</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getReporterTypeBadge = (type: string) => {
    switch (type) {
      case 'estate_manager':
        return <Badge variant="outline">Estate Manager</Badge>;
      case 'home_owner':
        return <Badge variant="outline">Home Owner</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search size={20} />
            Tenant Report Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Enter tenant name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
          {searchResults.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User size={18} />
                      {report.tenantName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{report.title}</p>
                  </div>
                  <div className="flex gap-2">
                    {getReportTypeBadge(report.reportType)}
                    {getReporterTypeBadge(report.reporterType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{report.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText size={14} />
                    <span>By: {report.reporterName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{report.createdAt.toLocaleDateString()}</span>
                  </div>
                  {report.propertyId && (
                    <div className="flex items-center gap-1">
                      <Building size={14} />
                      <span>Property: {report.propertyId}</span>
                    </div>
                  )}
                </div>

                {report.tags && report.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap">
                    {report.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searchResults.length === 0 && searchTerm && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No reports found for "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantSearch;

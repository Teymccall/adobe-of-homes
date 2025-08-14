import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { scrapingService, ScrapedProperty, ScrapingJob } from '@/services/scrapingService';
import { propertyService } from '@/services/propertyService';
import { 
  Play, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Square,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';

interface PropertyCardProps {
  property: ScrapedProperty;
  onImport: (property: ScrapedProperty) => void;
  isImporting: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onImport, isImporting }) => {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video relative">
        {property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90">
            {property.source}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{property.title}</h3>
        
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">
            {property.currency} {property.price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{property.location}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} beds</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} baths</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {property.images.length} images
          </div>
          <Button
            size="sm"
            onClick={() => onImport(property)}
            disabled={isImporting}
          >
            {isImporting ? 'Importing...' : 'Import'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ScrapingManagement: React.FC = () => {
  const [scrapingStatus, setScrapingStatus] = useState<'idle' | 'scraping' | 'completed' | 'error'>('idle');
  const [scrapedProperties, setScrapedProperties] = useState<ScrapedProperty[]>([]);
  const [scrapingJobs, setScrapingJobs] = useState<ScrapingJob[]>([]);
  const [importingProperties, setImportingProperties] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Update scraping jobs periodically
    const interval = setInterval(() => {
      setScrapingJobs(scrapingService.getScrapingJobs());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const startScraping = async (source: string) => {
    setScrapingStatus('scraping');
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const properties = await scrapingService.scrapeProperties(source);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setScrapedProperties(properties);
      setScrapingStatus('completed');
      
      toast({
        title: "Scraping Completed",
        description: `Successfully scraped ${properties.length} properties from ${source}`,
      });
    } catch (error) {
      setScrapingStatus('error');
      setProgress(0);
      
      toast({
        title: "Scraping Failed",
        description: `Failed to scrape properties from ${source}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const importProperty = async (property: ScrapedProperty) => {
    const propertyId = `${property.source}_${property.sourceUrl.split('/').pop()}`;
    setImportingProperties(prev => new Set(prev).add(propertyId));
    
    try {
      await scrapingService.importPropertiesToDatabase([property]);
      
      toast({
        title: "Property Imported",
        description: `Successfully imported "${property.title}" to the database`,
      });
      
      // Remove from scraped properties list
      setScrapedProperties(prev => prev.filter(p => p !== property));
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import property: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setImportingProperties(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  const importAllProperties = async () => {
    if (scrapedProperties.length === 0) return;
    
    setScrapingStatus('scraping');
    setProgress(0);
    
    try {
      const importedIds = await scrapingService.importPropertiesToDatabase(scrapedProperties);
      
      setScrapedProperties([]);
      setScrapingStatus('completed');
      setProgress(100);
      
      toast({
        title: "Bulk Import Completed",
        description: `Successfully imported ${importedIds.length} properties to the database`,
      });
    } catch (error) {
      setScrapingStatus('error');
      setProgress(0);
      
      toast({
        title: "Bulk Import Failed",
        description: `Failed to import properties: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Property Scraping</h2>
          <p className="text-gray-600">
            Scrape real properties from Ghana real estate websites
          </p>
        </div>
      </div>

      <Tabs defaultValue="scraping" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scraping">Scraping Jobs</TabsTrigger>
          <TabsTrigger value="properties">Scraped Properties</TabsTrigger>
          <TabsTrigger value="jobs">Job History</TabsTrigger>
        </TabsList>

        <TabsContent value="scraping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Start Scraping</CardTitle>
              <CardDescription>
                Choose a source to scrape properties from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  onClick={() => startScraping('ghanahomes')}
                  disabled={scrapingStatus === 'scraping'}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Home className="h-6 w-6" />
                  <span>GhanaHomes</span>
                </Button>
                
                <Button
                  onClick={() => startScraping('lamudi')}
                  disabled={scrapingStatus === 'scraping'}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Home className="h-6 w-6" />
                  <span>Lamudi Ghana</span>
                </Button>
                
                <Button
                  onClick={() => startScraping('jiji')}
                  disabled={scrapingStatus === 'scraping'}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Home className="h-6 w-6" />
                  <span>Jiji.gh</span>
                </Button>
              </div>

              {scrapingStatus === 'scraping' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Scraping properties...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              {scrapingStatus === 'error' && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Scraping failed. Please try again or check your internet connection.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          {scrapedProperties.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Scraped Properties ({scrapedProperties.length})
                </h3>
                <Button onClick={importAllProperties} disabled={scrapingStatus === 'scraping'}>
                  <Download className="h-4 w-4 mr-2" />
                  Import All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scrapedProperties.map((property, index) => (
                  <PropertyCard
                    key={index}
                    property={property}
                    onImport={importProperty}
                    isImporting={importingProperties.has(`${property.source}_${property.sourceUrl.split('/').pop()}`)}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No Scraped Properties
                </h3>
                <p className="text-gray-500 text-center">
                  Start a scraping job to see properties here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scraping Job History</CardTitle>
              <CardDescription>
                Recent scraping jobs and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scrapingJobs.length > 0 ? (
                <div className="space-y-4">
                  {scrapingJobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(job.status)}
                        <div>
                          <h4 className="font-semibold">{job.source}</h4>
                          <p className="text-sm text-gray-600">
                            {job.propertiesFound} properties found, {job.propertiesImported} imported
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(job.startedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No scraping jobs yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScrapingManagement; 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentDownloadProps {
  documentUrl?: string;
  documentName?: string;
  applicantName?: string;
  documentType?: string;
  className?: string;
}

export const DocumentDownloadHandler: React.FC<DocumentDownloadProps> = ({
  documentUrl,
  documentName,
  applicantName,
  documentType = 'document',
  className = ''
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!documentUrl) {
      toast({
        title: "Error",
        description: "No document available for download",
        variant: "destructive"
      });
      return;
    }

    setIsDownloading(true);

    try {
      // Get file extension from URL
      const getFileExtension = (url: string) => {
        const match = url.match(/\.([^.]+)$/);
        return match ? match[1] : 'pdf';
      };

      // Create a proper filename
      const fileName = documentName || 
        `${applicantName?.replace(/\s+/g, '_')}_${documentType}_${Date.now()}.${getFileExtension(documentUrl)}`;

      // Fetch the document
      const response = await fetch(documentUrl);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Document not found');
        } else if (response.status === 403) {
          throw new Error('Access denied to document');
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Check file size (50MB limit)
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
        throw new Error('File too large to download (max 50MB)');
      }

      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Document downloaded successfully",
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Unable to download document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleDownload}
      disabled={isDownloading || !documentUrl}
      className={className}
    >
      {isDownloading ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Download size={16} className="mr-2" />
      )}
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  );
};

// Alternative direct download function for existing components
export const downloadDocument = async (
  documentUrl: string,
  fileName?: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
) => {
  try {
    const response = await fetch(documentUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch document');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName || `document_${Date.now()}.pdf`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    onSuccess?.();
  } catch (error) {
    console.error('Download error:', error);
    onError?.('Failed to download document');
  }
};

import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, Image, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCloudinaryUpload, UploadState } from '@/hooks/useCloudinaryUpload';
import { CloudinaryUploadResult } from '@/services/cloudinaryService';

interface CloudinaryUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  folder?: 'properties' | 'profiles' | 'documents' | 'artisans';
  onUploadComplete?: (results: CloudinaryUploadResult[]) => void;
  onUploadStart?: () => void;
  disabled?: boolean;
  className?: string;
}

export const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({
  accept = "image/*",
  multiple = false,
  maxFiles = 5,
  folder,
  onUploadComplete,
  onUploadStart,
  disabled = false,
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadState, uploadSingle, uploadMultiple, resetState } = useCloudinaryUpload();

  // Handle file selection
  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.slice(0, maxFiles);
    
    setSelectedFiles(validFiles);
    
    // Create preview URLs for images
    const urls = validFiles.map(file => {
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      return '';
    });
    setPreviewUrls(urls);
  }, [maxFiles]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    try {
      onUploadStart?.();
      
      let results: CloudinaryUploadResult[];
      
      if (selectedFiles.length === 1) {
        const result = await uploadSingle({
          file: selectedFiles[0],
          options: { folder }
        });
        results = [result];
      } else {
        results = await uploadMultiple({
          files: selectedFiles,
          options: { folder }
        });
      }
      
      onUploadComplete?.(results);
      
      // Clean up
      setSelectedFiles([]);
      setPreviewUrls([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  // Remove file from selection
  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newUrls = previewUrls.filter((_, i) => i !== index);
    
    setSelectedFiles(newFiles);
    setPreviewUrls(newUrls);
    
    // Revoke URL to prevent memory leaks
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
  };

  // Reset upload state
  const handleReset = () => {
    resetState();
    setSelectedFiles([]);
    setPreviewUrls([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          {dragActive ? 'Drop files here' : 'Choose files or drag and drop'}
        </p>
        <p className="text-sm text-gray-500">
          {accept.includes('image') ? 'Images' : 'Files'} up to 10MB each
          {multiple && ` (max ${maxFiles} files)`}
        </p>
      </div>

      {/* Error Display */}
      {uploadState.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadState.error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Progress */}
      {uploadState.isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(uploadState.progress)}%</span>
          </div>
          <Progress value={uploadState.progress} className="w-full" />
        </div>
      )}

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={uploadState.isUploading}
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedFiles.map((file, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      {file.type.startsWith('image/') && previewUrls[index] ? (
                        <img
                          src={previewUrls[index]}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <Image className="w-6 h-6 text-gray-400" />
                          ) : (
                            <FileText className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </Badge>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      disabled={uploadState.isUploading}
                      className="flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploadState.isUploading}
            className="w-full"
          >
            {uploadState.isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}

      {/* Upload Results */}
      {uploadState.results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-green-700">Upload Complete!</h4>
          <div className="space-y-2">
            {uploadState.results.map((result, index) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{result.originalFilename}</p>
                    <p className="text-xs text-gray-500">Public ID: {result.publicId}</p>
                  </div>
                  <Badge variant="default">Uploaded</Badge>
                </div>
                {result.secureUrl && (
                  <a
                    href={result.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View File
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload; 
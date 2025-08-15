import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, MapPin, Phone, Mail, Building, Calendar, FileText, Image as ImageIcon } from 'lucide-react';
import { DocumentDownloadHandler } from '@/components/ui/DocumentDownloadHandler';

interface ApplicationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  priority: 'low' | 'medium' | 'high';
  profileImageUrl?: string;
  idType: string;
  idNumber: string;
  idImageUrl?: string;
  about: string;
  experience?: number;
  company?: string;
  previousProperties?: number;
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

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: ApplicationData;
  onStatusUpdate?: (applicationId: string, status: string) => void;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  isOpen,
  onClose,
  application,
  onStatusUpdate
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (window.confirm(`Are you sure you want to ${action} this application?`)) {
      onStatusUpdate?.(application.id, newStatus);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Home Owner Application Review
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive review of {application.name}'s application
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
              
              {application.profileImageUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={application.profileImageUrl}
                    alt={application.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm">Full Name</label>
                  <p className="text-gray-700">{application.name}</p>
                </div>

                <div>
                  <label className="font-medium text-sm flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <p className="text-gray-700">{application.email}</p>
                </div>

                <div>
                  <label className="font-medium text-sm flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <p className="text-gray-700">{application.phone}</p>
                </div>

                <div>
                  <label className="font-medium text-sm flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Location
                  </label>
                  <p className="text-gray-700">{application.location}</p>
                </div>

                <div>
                  <label className="font-medium text-sm">Region</label>
                  <p className="text-gray-700">{application.region}</p>
                </div>

                <div>
                  <label className="font-medium text-sm flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Application Date
                  </label>
                  <p className="text-gray-700">
                    {formatDate(application.submittedDate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Business Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm">About</label>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {application.about}
                  </p>
                </div>

                {application.experience && (
                  <div>
                    <label className="font-medium text-sm">Experience</label>
                    <p className="text-gray-700">{application.experience} years</p>
                  </div>
                )}

                {application.company && (
                  <div>
                    <label className="font-medium text-sm">Company</label>
                    <p className="text-gray-700">{application.company}</p>
                  </div>
                )}

                {application.previousProperties && (
                  <div>
                    <label className="font-medium text-sm">Previous Properties</label>
                    <p className="text-gray-700">
                      {application.previousProperties} properties managed
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents & Status */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Documents & Status</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="font-medium text-sm">Current Status</label>
                  <Badge className={`${getStatusColor(application.status)} capitalize`}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <label className="font-medium text-sm">Priority Level</label>
                  <Badge className={`${getPriorityColor(application.priority)} capitalize`}>
                    {application.priority} Priority
                  </Badge>
                </div>

                <div>
                  <label className="font-medium text-sm">Identification</label>
                  <p className="text-gray-700 capitalize">{application.idType}</p>
                  <p className="text-gray-700 text-sm">{application.idNumber}</p>
                </div>

                {/* Profile Image Download */}
                {application.profileImageUrl && (
                  <div>
                    <label className="font-medium text-sm mb-2 block flex items-center gap-1">
                      <ImageIcon className="h-4 w-4" />
                      Profile Image
                    </label>
                    <DocumentDownloadHandler
                      documentUrl={application.profileImageUrl}
                      documentName={`${application.name}_Profile_Image.jpg`}
                      applicantName={application.name}
                      documentType="profile_image"
                      className="w-full"
                    />
                  </div>
                )}

                {/* ID Document Download */}
                {application.idImageUrl && (
                  <div>
                    <label className="font-medium text-sm mb-2 block flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      ID Document
                    </label>
                    <DocumentDownloadHandler
                      documentUrl={application.idImageUrl}
                      documentName={`${application.name}_ID_Document.pdf`}
                      applicantName={application.name}
                      documentType="identification"
                      className="w-full"
                    />
                  </div>
                )}

                {/* Cloudinary Data Downloads (if available) */}
                {application.cloudinaryData && (
                  <>
                    {application.cloudinaryData.profileImage?.url && (
                      <div>
                        <label className="font-medium text-sm mb-2 block flex items-center gap-1">
                          <ImageIcon className="h-4 w-4" />
                          Profile Image (Cloudinary)
                        </label>
                        <DocumentDownloadHandler
                          documentUrl={application.cloudinaryData.profileImage.url}
                          documentName={`${application.name}_Profile_Image_Cloudinary.jpg`}
                          applicantName={application.name}
                          documentType="profile_image"
                          className="w-full"
                        />
                      </div>
                    )}

                    {application.cloudinaryData.idImage?.url && (
                      <div>
                        <label className="font-medium text-sm mb-2 block flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          ID Document (Cloudinary)
                        </label>
                        <DocumentDownloadHandler
                          documentUrl={application.cloudinaryData.idImage.url}
                          documentName={`${application.name}_ID_Document_Cloudinary.pdf`}
                          applicantName={application.name}
                          documentType="identification"
                          className="w-full"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              {onStatusUpdate && (
                <div className="mt-6 space-y-2">
                  <Button
                    onClick={() => handleStatusUpdate('approved')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={application.status === 'approved'}
                  >
                    Approve Application
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate('rejected')}
                    variant="destructive"
                    className="w-full"
                    disabled={application.status === 'rejected'}
                  >
                    Reject Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState, useEffect } from 'react';
import { Check, X, Eye, Hammer, Search, Calendar, MapPin, Phone, Mail, User, Download, Star, Award, Clock, FileText, Wrench, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { adminService } from '@/services/adminService';
import { authService } from '@/services/authService';
import { DocumentDownloadHandler } from '@/components/ui/DocumentDownloadHandler';

interface EnhancedArtisanApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  skills: string[];
  about: string;
  profileImageUrl: string;
  idImageUrl: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  experience: number;
  specialization: string;
  certifications?: string[];
  workSamples?: string[];
  references?: string[];
  hourlyRate?: number;
  availability: 'full_time' | 'part_time' | 'weekends' | 'flexible';
  tools?: string[];
  priority: 'high' | 'medium' | 'low';
  lastUpdated: string;
  reviewedBy?: string;
  reviewNotes?: string;
  rating?: number;
  completedProjects?: number;
}



const ArtisanApplicationsList = () => {
  const { toast } = useToast();
  const [applications, setApplications] = useState<EnhancedArtisanApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<EnhancedArtisanApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getArtisanApplications();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching artisan applications:', error);
        toast({
          title: "Error",
          description: "Failed to load artisan applications. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [toast]);
  const [skillFilter, setSkillFilter] = useState<string>('all');

  // Filter applications based on search and filters
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || app.priority === priorityFilter;
    const matchesSkill = skillFilter === 'all' || app.skills.includes(skillFilter);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesSkill;
  });

  // Get unique skills for filter
  const allSkills = Array.from(new Set(applications.flatMap(app => app.skills)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'under_review': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'full_time': return 'default';
      case 'part_time': return 'secondary';
      case 'weekends': return 'outline';
      case 'flexible': return 'default';
      default: return 'secondary';
    }
  };

  const viewApplication = (application: EnhancedArtisanApplication) => {
    setSelectedApplication(application);
    setReviewNotes(application.reviewNotes || '');
    setIsDialogOpen(true);
  };

  const handleStatusChange = (action: 'approve' | 'reject') => {
    setConfirmAction(action);
    setIsConfirmDialogOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedApplication || !confirmAction) return;

    try {
      const newStatus = confirmAction === 'approve' ? 'approved' : 'rejected';
      
      await adminService.updateApplicationStatus(
        'artisanApplications',
        selectedApplication.id,
        newStatus,
        'Current Admin',
        reviewNotes
      );
      
      // Update local state
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? { 
          ...app, 
          status: newStatus,
          reviewedBy: 'Current Admin',
          reviewNotes: reviewNotes,
          lastUpdated: new Date().toISOString().split('T')[0]
        } : app
      ));
      
      toast({
        title: `Application ${confirmAction === 'approve' ? 'Approved' : 'Rejected'}`,
        description: confirmAction === 'approve' 
          ? `${selectedApplication.name}'s artisan application has been approved. Password reset email sent to ${selectedApplication.email}.`
          : `${selectedApplication.name}'s artisan application has been rejected.`,
        variant: confirmAction === 'approve' ? 'default' : 'destructive'
      });
      
      setIsDialogOpen(false);
      setIsConfirmDialogOpen(false);
      setSelectedApplication(null);
      setConfirmAction(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSendPasswordReset = async () => {
    if (!selectedApplication) return;

    setIsSendingPasswordReset(true);
    try {
      await authService.resetPassword(selectedApplication.email);
      
      toast({
        title: "Password Reset Sent",
        description: `Password reset email has been sent to ${selectedApplication.email}`,
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error sending password reset:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return `GH₵ ${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <Hammer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold">{applications.filter(app => app.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{applications.filter(app => app.status === 'approved').length}</p>
              </div>
              <Check className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold">{applications.filter(app => app.status === 'under_review').length}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search by name, email, location, or skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Artisan Applications ({filteredApplications.length})</CardTitle>
          <CardDescription>Review and manage artisan applications</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading artisan applications...</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Hammer size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No applications found</p>
              <p>No applications match your current filters.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Skills & Experience</TableHead>
                  <TableHead>Rate & Availability</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={application.profileImageUrl} alt={application.name} />
                          <AvatarFallback>{getInitials(application.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{application.name}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3" />
                            {application.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <MapPin className="h-3 w-3" />
                            {application.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {application.skills.slice(0, 3).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {application.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{application.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Award className="h-3 w-3 text-blue-500" />
                          <span>{application.experience} years experience</span>
                        </div>
                        {application.rating && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{application.rating}/5.0</span>
                            {application.completedProjects && (
                              <span className="text-gray-500">({application.completedProjects} projects)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {application.hourlyRate && (
                          <p className="font-medium">{formatCurrency(application.hourlyRate)}/hour</p>
                        )}
                        <Badge variant={getAvailabilityColor(application.availability) as any} className="text-xs capitalize">
                          {application.availability.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs text-gray-500">{application.specialization}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(application.status) as any} className="capitalize">
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(application.priority) as any} className="capitalize">
                        {application.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {formatDate(application.submittedDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewApplication(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Application Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedApplication && (
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Hammer className="h-5 w-5" />
                Artisan Application Review
              </DialogTitle>
              <DialogDescription>
                Comprehensive review of {selectedApplication.name}'s artisan application
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedApplication.profileImageUrl} alt={selectedApplication.name} />
                      <AvatarFallback className="text-lg">{getInitials(selectedApplication.name)}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Phone</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Region</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.region}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Application Date</Label>
                      <p className="text-sm text-gray-700">{formatDate(selectedApplication.submittedDate)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Professional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">About</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedApplication.about}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Experience</Label>
                    <p className="text-sm text-gray-700">{selectedApplication.experience} years</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Specialization</Label>
                    <p className="text-sm text-gray-700">{selectedApplication.specialization}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Skills</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedApplication.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedApplication.certifications && (
                    <div>
                      <Label className="text-sm font-medium">Certifications</Label>
                      <div className="space-y-1">
                        {selectedApplication.certifications.map((cert, index) => (
                          <p key={index} className="text-sm text-gray-700">• {cert}</p>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApplication.hourlyRate && (
                    <div>
                      <Label className="text-sm font-medium">Hourly Rate</Label>
                      <p className="text-sm text-gray-700">{formatCurrency(selectedApplication.hourlyRate)}/hour</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium">Availability</Label>
                    <Badge variant={getAvailabilityColor(selectedApplication.availability) as any} className="mt-1 capitalize">
                      {selectedApplication.availability.replace('_', ' ')}
                    </Badge>
                  </div>
                  {selectedApplication.rating && (
                    <div>
                      <Label className="text-sm font-medium">Rating & Projects</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{selectedApplication.rating}/5.0</span>
                        </div>
                        {selectedApplication.completedProjects && (
                          <span className="text-sm text-gray-500">({selectedApplication.completedProjects} completed)</span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Documents & Portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Documents & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Current Status */}
                  <div>
                    <Label className="text-sm font-medium">Current Status</Label>
                    <div className="mt-1">
                      <Badge variant={getStatusColor(selectedApplication.status) as any} className="capitalize">
                        {selectedApplication.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Priority Level</Label>
                    <div className="mt-1">
                      <Badge variant={getPriorityColor(selectedApplication.priority) as any} className="capitalize">
                        {selectedApplication.priority} Priority
                      </Badge>
                    </div>
                  </div>

                  {/* ID Document */}
                  <div>
                    <Label className="text-sm font-medium">ID Document</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img 
                        src={selectedApplication.idImageUrl} 
                        alt="ID Document" 
                        className="w-full h-auto max-h-48 object-cover"
                      />
                      <div className="p-2 bg-gray-50 text-center">
                        <DocumentDownloadHandler
                          documentUrl={selectedApplication.idImageUrl}
                          documentName={`${selectedApplication.name}_ID_Document.pdf`}
                          applicantName={selectedApplication.name}
                          documentType="identification"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Work Samples */}
                  {selectedApplication.workSamples && selectedApplication.workSamples.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Work Samples</Label>
                      <div className="mt-2 space-y-2">
                        {selectedApplication.workSamples.map((sample, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">Sample {index + 1}</span>
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tools */}
                  {selectedApplication.tools && (
                    <div>
                      <Label className="text-sm font-medium">Professional Tools</Label>
                      <div className="space-y-1 mt-1">
                        {selectedApplication.tools.map((tool, index) => (
                          <p key={index} className="text-sm text-gray-700">• {tool}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* References */}
                  {selectedApplication.references && (
                    <div>
                      <Label className="text-sm font-medium">References</Label>
                      <div className="space-y-1 mt-1">
                        {selectedApplication.references.map((ref, index) => (
                          <p key={index} className="text-sm text-gray-700">{ref}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Information */}
                  {selectedApplication.reviewedBy && (
                    <div>
                      <Label className="text-sm font-medium">Previously Reviewed By</Label>
                      <p className="text-sm text-gray-700">{selectedApplication.reviewedBy}</p>
                      <p className="text-xs text-gray-500">Last updated: {formatDate(selectedApplication.lastUpdated)}</p>
                    </div>
                  )}

                  {/* Password Reset Information for Approved Applications */}
                  {selectedApplication.status === 'approved' && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Mail className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <Label className="text-sm font-medium text-blue-800">Password Reset</Label>
                          <p className="text-xs text-blue-700 mt-1">
                            If the artisan didn't receive the automatic password reset email or needs a new one, 
                            click "Send Password Reset" below to manually send another email.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Review Notes */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Review Notes</CardTitle>
                <CardDescription>Add your review comments and decision notes</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter your review notes, feedback, or reasons for approval/rejection..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-24"
                />
                {selectedApplication.reviewNotes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Previous Notes:</Label>
                    <p className="text-sm text-gray-700 mt-1">{selectedApplication.reviewNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <DialogFooter className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              {selectedApplication.status === 'pending' || selectedApplication.status === 'under_review' ? (
                <>
                  <Button 
                    variant="destructive"
                    onClick={() => handleStatusChange('reject')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </Button>
                  <Button onClick={() => handleStatusChange('approve')}>
                    <Check className="h-4 w-4 mr-2" />
                    Approve Application
                  </Button>
                </>
              ) : selectedApplication.status === 'approved' ? (
                <div className="flex gap-2 items-center">
                  <Badge variant={getStatusColor(selectedApplication.status) as any} className="py-2 px-4">
                    Already Approved
                  </Badge>
                  <Button 
                    variant="outline"
                    onClick={handleSendPasswordReset}
                    disabled={isSendingPasswordReset}
                    className="gap-2"
                  >
                    {isSendingPasswordReset ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    {isSendingPasswordReset ? 'Sending...' : 'Send Password Reset'}
                  </Button>
                </div>
              ) : (
                <Badge variant={getStatusColor(selectedApplication.status) as any} className="py-2 px-4">
                  Already Rejected
                </Badge>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === 'approve' ? 'Approve Artisan Application' : 'Reject Artisan Application'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {confirmAction} {selectedApplication?.name}'s artisan application?
              {confirmAction === 'approve' 
                ? ' They will be granted access to offer services on the platform.'
                : ' They will be notified of the rejection and can reapply in the future.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmStatusChange}
              className={confirmAction === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              {confirmAction === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ArtisanApplicationsList;

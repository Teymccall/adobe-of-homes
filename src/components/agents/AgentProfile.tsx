
import React, { useState } from 'react';
import { User, Mail, Phone, Building, Star, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/services/authService';
import { authService } from '@/services/authService';

interface AgentProfileProps {
  agent: UserProfile;
}

const AgentProfile = ({ agent }: AgentProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: agent.displayName,
    email: agent.email,
    phone: agent.phone || '',
    company: agent.company || '',
    bio: agent.bio || '',
    yearsOfExperience: agent.yearsOfExperience || 0,
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await authService.updateUserProfile(agent.uid, {
        displayName: formData.displayName,
        phone: formData.phone,
        company: formData.company,
        bio: formData.bio,
        yearsOfExperience: formData.yearsOfExperience,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: agent.displayName,
      email: agent.email,
      phone: agent.phone || '',
      company: agent.company || '',
      bio: agent.bio || '',
      yearsOfExperience: agent.yearsOfExperience || 0,
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Profile</h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                <Edit size={16} />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save size={16} />
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                  <X size={16} />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your profile information is only visible to system administrators and will not be displayed on public pages.
          </p>
        </div>

        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl mb-4">
              {agent.displayName?.charAt(0) || 'U'}
            </div>
            <div className="flex items-center">
              <Star className="text-yellow-500 mr-1" size={16} />
              <span>5.0 (0 reviews)</span>
            </div>
          </div>
          
          <div className="md:w-2/3">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange('displayName', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.yearsOfExperience}
                    onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{agent.displayName}</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} />
                    <span>{agent.email}</span>
                  </div>
                  
                  {agent.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={16} />
                      <span>{agent.phone}</span>
                    </div>
                  )}
                  
                  {agent.company && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building size={16} />
                      <span>{agent.company}</span>
                    </div>
                  )}
                  
                  {agent.yearsOfExperience && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User size={16} />
                      <span>{agent.yearsOfExperience} years of experience</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-muted-foreground">{agent.bio}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;

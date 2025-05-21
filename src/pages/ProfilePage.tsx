
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  linkedinHeadline: string;
  linkedinProfileUrl: string;
  profilePicture: string;
}

const ProfilePage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    linkedinHeadline: '',
    linkedinProfileUrl: '',
    profilePicture: '/placeholder.svg',
  });
  
  // Populate form with user data
  useEffect(() => {
    if (user && profile) {
      setFormData({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: user.email || '',
        linkedinHeadline: profile.linkedin_headline || '',
        linkedinProfileUrl: `https://linkedin.com/in/${user.id.substring(0, 8)}`,
        profilePicture: profile.profile_picture_url || '/placeholder.svg',
      });
    }
  }, [user, profile]);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
    
    setIsUploading(true);
    
    try {
      // Create a storage bucket first if it doesn't exist
      // This will be implemented in a future update
      
      // Upload the file to a storage bucket
      // For now, we'll just update the URL without actual upload
      // In a real implementation, you'd upload to Supabase storage
      
      // Mock the URL for now
      const fileUrl = URL.createObjectURL(file);
      
      // Update the form data
      setFormData(prev => ({
        ...prev,
        profilePicture: fileUrl
      }));
      
      toast({
        title: "File selected",
        description: "Your profile picture has been selected. Save to apply changes."
      });
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message || "Failed to upload profile picture."
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveProfilePicture = () => {
    setFormData(prev => ({
      ...prev,
      profilePicture: '/placeholder.svg'
    }));
    
    toast({
      title: "Profile picture removed",
      description: "Save to apply changes."
    });
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update the profile in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          linkedin_headline: formData.linkedinHeadline,
          profile_picture_url: formData.profilePicture !== '/placeholder.svg' ? formData.profilePicture : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      
      // In a real implementation, you would also update the email through Supabase Auth
      // if it has changed, but that requires additional verification
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  return (
    <SidebarLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Profile Information</h1>
        <p className="text-gray-500 mb-6">Update your personal details and upload a new profile picture.</p>
        
        <Card>
          <CardContent className="pt-6">
            {/* Profile Picture */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-white shadow">
                  <AvatarImage src={formData.profilePicture} />
                  <AvatarFallback className="text-xl">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <label htmlFor="profile-picture" className="absolute bottom-0 right-0">
                  <Button 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </Button>
                  <input 
                    type="file" 
                    id="profile-picture" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
                <button 
                  onClick={handleRemoveProfilePicture}
                  className="absolute -bottom-6 w-full text-center text-xs text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled // Email changes require verification
                />
                <p className="text-xs text-gray-500">Email changes require verification and are not supported in this demo.</p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="linkedinHeadline" className="text-sm font-medium">LinkedIn Headline</label>
                <Input
                  id="linkedinHeadline"
                  placeholder="Enter your LinkedIn headline..."
                  value={formData.linkedinHeadline}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="linkedinProfileUrl" className="text-sm font-medium">LinkedIn Profile URL</label>
                <Input
                  id="linkedinProfileUrl"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={formData.linkedinProfileUrl}
                  onChange={handleChange}
                  disabled // Simplified for demo
                />
              </div>
            </div>
            
            {/* Save Button */}
            <div className="mt-8">
              <Button 
                onClick={handleSave} 
                className="w-full md:w-auto bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : 'Update Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default ProfilePage;

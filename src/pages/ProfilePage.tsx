
import React, { useState } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';

const ProfilePage = () => {
  // Mock user data
  const [user, setUser] = useState({
    firstName: 'Christopher',
    lastName: 'Obeng',
    email: 'christopher.obeng@email.com',
    linkedinHeadline: '',
    linkedinProfileUrl: 'https://linkedin.com/in/your-profile',
    profilePicture: '/placeholder.svg',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback className="text-xl">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <span className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
                  Remove
                </span>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                <Input
                  id="firstName"
                  value={user.firstName}
                  onChange={(e) => setUser({...user, firstName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                <Input
                  id="lastName"
                  value={user.lastName}
                  onChange={(e) => setUser({...user, lastName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="linkedinHeadline" className="text-sm font-medium">LinkedIn Headline</label>
                <Input
                  id="linkedinHeadline"
                  placeholder="Enter your LinkedIn headline..."
                  value={user.linkedinHeadline}
                  onChange={(e) => setUser({...user, linkedinHeadline: e.target.value})}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="linkedinUrl" className="text-sm font-medium">LinkedIn Profile URL</label>
                <Input
                  id="linkedinUrl"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={user.linkedinProfileUrl}
                  onChange={(e) => setUser({...user, linkedinProfileUrl: e.target.value})}
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
                {loading ? 'Saving...' : 'Update Profile'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default ProfilePage;


import React, { useState } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  // Mock password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Mock notification preferences
  const [notifications, setNotifications] = useState({
    scheduledPosts: true,
    performanceReports: true,
    productUpdates: false,
    tips: false,
  });
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password change logic here
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Integration</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          {/* Account Settings Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                <p className="text-gray-500 mb-6">Manage your password, notifications, and subscription.</p>
                
                {/* Password Change Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="text-sm font-medium block mb-1">Current Password</label>
                      <Input 
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="text-sm font-medium block mb-1">New Password</label>
                      <Input 
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="text-sm font-medium block mb-1">Confirm New Password</label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      />
                    </div>
                    
                    <Button type="submit" className="bg-primary hover:bg-primary/90">
                      Change Password
                    </Button>
                  </form>
                </div>
                
                {/* Notifications Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="scheduledPosts" 
                        checked={notifications.scheduledPosts}
                        onCheckedChange={(checked) => handleNotificationChange('scheduledPosts', checked as boolean)}
                      />
                      <div className="grid gap-1.5">
                        <label htmlFor="scheduledPosts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Email notifications for scheduled posts
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="performanceReports" 
                        checked={notifications.performanceReports}
                        onCheckedChange={(checked) => handleNotificationChange('performanceReports', checked as boolean)}
                      />
                      <div className="grid gap-1.5">
                        <label htmlFor="performanceReports" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Post performance reports
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="productUpdates" 
                        checked={notifications.productUpdates}
                        onCheckedChange={(checked) => handleNotificationChange('productUpdates', checked as boolean)}
                      />
                      <div className="grid gap-1.5">
                        <label htmlFor="productUpdates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Product updates and news
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="tips" 
                        checked={notifications.tips}
                        onCheckedChange={(checked) => handleNotificationChange('tips', checked as boolean)}
                      />
                      <div className="grid gap-1.5">
                        <label htmlFor="tips" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Tips and best practices
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Subscription Section */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Subscription</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-md border mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">Plan:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Free</Badge>
                      </div>
                      <Button className="bg-secondary hover:bg-secondary/90 text-white">
                        Upgrade Plan
                      </Button>
                    </div>
                    <ul className="text-sm space-y-1 pl-5 list-disc text-gray-600">
                      <li>3 generated posts per week</li>
                      <li>Basic engagement stats</li>
                      <li>Standard support</li>
                    </ul>
                  </div>
                </div>
                
                {/* Delete Account */}
                <div>
                  <h3 className="text-lg font-medium mb-4 text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Warning: This action is irreversible and will permanently delete your account and all your posts.
                  </p>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Placeholder for other tabs - we'll only implement the Account tab in detail */}
          <TabsContent value="profile">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <p className="text-gray-500 mt-2 mb-4">Update your personal information and profile picture.</p>
                <Button asChild>
                  <a href="/profile">Go to Profile</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold">Content Preferences</h2>
                <p className="text-gray-500 mt-2">Configure your writing style, industry, and content categories.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="linkedin">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold">LinkedIn Integration</h2>
                <p className="text-gray-500 mt-2">Connect your LinkedIn account and manage API permissions.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="billing">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold">Billing & Subscription</h2>
                <p className="text-gray-500 mt-2">Manage your plan, payment methods, and view invoice history.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarLayout>
  );
};

export default SettingsPage;

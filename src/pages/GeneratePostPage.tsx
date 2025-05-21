
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserPreferences {
  id: string;
  writing_styles: string[];
  industries: string[];
  job_descriptions: string[];
  content_categories: string[];
  posting_goals: string[];
  custom_cta?: string | null;
  fine_tuning_notes?: string | null;
}

interface Post {
  id: string;
  title?: string;
  content: string;
  status: string;
  topic?: string;
  image_url?: string;
}

const GeneratePostPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editPostId = searchParams.get('edit');
  
  const [topic, setTopic] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user preferences
  const { data: userPreferences, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['userPreferences', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();
      
      if (error) throw error;
      
      return data as UserPreferences | null;
    },
    enabled: !!user,
  });

  // Fetch post if editing
  const { data: postData, isLoading: isLoadingPost } = useQuery({
    queryKey: ['post', editPostId],
    queryFn: async () => {
      if (!editPostId) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', editPostId)
        .single();
      
      if (error) throw error;
      
      return data as Post;
    },
    enabled: !!editPostId && !!user,
  });

  // Set form data if editing an existing post
  useEffect(() => {
    if (postData) {
      setIsEditing(true);
      setTopic(postData.topic || '');
      setPostTitle(postData.title || '');
      setGeneratedContent(postData.content || '');
    }
  }, [postData]);

  const handleGenerateContent = async () => {
    if (!topic.trim()) {
      toast({
        variant: "destructive",
        title: "Topic required",
        description: "Please enter a topic for your LinkedIn post."
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch(
        `https://kjthowdyywptosrqcuxs.supabase.co/functions/v1/generate-post`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabase.auth.getSession()}`
          },
          body: JSON.stringify({
            topic,
            userPreferences: userPreferences || {}
          })
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }
      
      setGeneratedContent(data.content);
      setPostTitle(topic); // Set default title as the topic
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error.message || "Failed to generate content. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePost = async (status: 'draft' | 'scheduled' | 'published' = 'draft') => {
    if (!generatedContent.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please generate or write content before saving."
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const postData = {
        user_id: user?.id,
        title: postTitle || topic,
        content: generatedContent,
        status,
        topic,
        // Include other fields like scheduled_date if status is 'scheduled'
        // Include published_date if status is 'published'
      };
      
      let response;
      
      if (isEditing && editPostId) {
        // Update existing post
        response = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editPostId);
      } else {
        // Create new post
        response = await supabase
          .from('posts')
          .insert(postData);
      }
      
      if (response.error) throw response.error;
      
      toast({
        title: isEditing ? "Post updated" : "Post saved",
        description: `Your post has been successfully ${isEditing ? 'updated' : 'saved'} as a ${status}.`
      });
      
      // Navigate to posts list
      navigate('/posts');
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message || "Failed to save post. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Define writing style options
  const writingStyles = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'witty', label: 'Witty' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'technical', label: 'Technical' },
  ];

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">{isEditing ? 'Edit Post' : 'Generate LinkedIn Post'}</h1>
        
        <div className="grid gap-6 grid-cols-1">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Topic & Preferences</CardTitle>
              <CardDescription>
                Enter your post topic and preferences to generate LinkedIn content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium mb-1">
                    What would you like to write about?
                  </label>
                  <Input
                    id="topic"
                    placeholder="e.g., AI in Healthcare, Leadership Skills, Product Launch"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="style" className="block text-sm font-medium mb-1">
                    Writing Style
                  </label>
                  <Select 
                    value={selectedStyle || (userPreferences?.writing_styles?.[0] || 'professional')} 
                    onValueChange={setSelectedStyle}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a writing style" />
                    </SelectTrigger>
                    <SelectContent>
                      {writingStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    For more writing preferences, go to Settings.
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    <FileUp className="h-4 w-4 mr-1" />
                    Upload Reference
                  </Button>
                  
                  <Button 
                    onClick={handleGenerateContent} 
                    className="bg-primary" 
                    disabled={isGenerating || !topic.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Post'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Post Preview</CardTitle>
              <CardDescription>
                Preview and edit your generated LinkedIn post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Post Title (Optional)
                  </label>
                  <Input
                    id="title"
                    placeholder="Enter a title for your post"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <Textarea
                    id="content"
                    placeholder={isGenerating ? "Generating content..." : "Generated content will appear here. You can edit it after generation."}
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px]"
                    disabled={isGenerating}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-gray-500">
                {generatedContent ? `${generatedContent.length} characters` : ''}
              </div>
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleSavePost('draft')}
                  disabled={isSaving || !generatedContent}
                >
                  {isSaving ? 'Saving...' : 'Save as Draft'}
                </Button>
                <Button
                  onClick={() => handleSavePost('published')}
                  className="bg-primary"
                  disabled={isSaving || !generatedContent}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Now'
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default GeneratePostPage;

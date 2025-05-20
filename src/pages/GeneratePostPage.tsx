
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Eye, FileUp, RefreshCw, Upload } from 'lucide-react';
import SidebarLayout from '@/components/layout/SidebarLayout';

const GeneratePostPage = () => {
  const { toast } = useToast();
  const [topic, setTopic] = useState('');
  const [style, setStyle] = useState('Witty');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Here we'd normally call the AI API
    // For demo purposes, let's simulate a response
    setTimeout(() => {
      const demoContent = generateDemoContent(topic, style);
      setGeneratedContent(demoContent);
      setLoading(false);
    }, 1500);
  };

  const handleRegenerate = () => {
    setLoading(true);
    
    // Simulate regeneration
    setTimeout(() => {
      const demoContent = generateDemoContent(topic, style);
      setGeneratedContent(demoContent);
      setLoading(false);
    }, 1500);
  };

  const handleSchedule = () => {
    if (!generatedContent) return;
    
    toast({
      title: 'Success',
      description: 'Post scheduled successfully',
    });
  };

  // Function to generate demo content
  const generateDemoContent = (topic: string, style: string) => {
    let content = '';
    
    switch (style) {
      case 'Witty':
        content = `Who else is thinking about ${topic} on a Monday? 😄\n\nI've been diving into this lately and found 3 surprising insights:\n\n1️⃣ Most people overlook the fundamentals\n2️⃣ The best opportunities are hiding in plain sight\n3️⃣ Success comes from consistent small actions, not grand gestures\n\nWhat's your experience with ${topic}? Let me know in the comments! #${topic.replace(/\s+/g, '')} #ProfessionalGrowth`;
        break;
      case 'Professional':
        content = `I've been researching ${topic} extensively, and I'd like to share some key findings with my network.\n\nThree critical aspects often overlooked:\n\n• Strategic implementation requires careful planning\n• Cross-functional collaboration drives better outcomes\n• Data-driven decision making significantly improves results\n\nI'd appreciate hearing your professional insights on ${topic}. What strategies have worked for you?\n\n#${topic.replace(/\s+/g, '')} #ProfessionalDevelopment`;
        break;
      case 'Conversational':
        content = `Hey connections!\n\nI've been thinking about ${topic} lately. It's fascinating how much this impacts our daily work, isn't it?\n\nHere's what I've learned so far:\n- It's more nuanced than it first appears\n- There's no one-size-fits-all approach\n- The landscape is constantly evolving\n\nI'm curious: What's your take on ${topic}? Drop your thoughts below!\n\n#${topic.replace(/\s+/g, '')} #LearningTogether`;
        break;
      default:
        content = `I've been exploring ${topic} recently and wanted to share some thoughts.\n\nKey takeaways:\n\n1. ${topic} is transforming how we approach business challenges\n2. The most successful professionals are adapting quickly\n3. There's still so much potential for innovation in this space\n\nWhat are your experiences with ${topic}? I'd love to hear your perspective.\n\n#${topic.replace(/\s+/g, '')} #ProfessionalInsights`;
    }
    
    return content;
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Generate LinkedIn Content</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column - Content Generation Form */}
          <div className="md:col-span-3">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <h2 className="text-xl font-medium mb-4">What would you like to post?</h2>
                  
                  <div className="space-y-4">
                    {/* Topic Input */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Your Topic</h3>
                      <Input
                        placeholder="Enter a topic using 5 words or more..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      />
                    </div>
                    
                    {/* File Upload */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Attach Files</h3>
                      <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
                        <FileUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Click or drag and drop to upload image, audio, or document
                        </p>
                        <Input
                          type="file"
                          className="hidden"
                          id="file-upload"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" /> Choose File
                        </Button>
                      </div>
                    </div>
                    
                    {/* Post Style */}
                    <div>
                      <h3 className="text-sm font-medium mb-2">Post Style</h3>
                      <Select value={style} onValueChange={setStyle}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Witty">Witty</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Conversational">Conversational</SelectItem>
                          <SelectItem value="Authoritative">Authoritative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Generate Button */}
                    <Button 
                      className="w-full bg-secondary hover:bg-secondary/90"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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
            
            {/* Settings Button */}
            <div className="mt-4 text-center">
              <Button variant="link" className="text-gray-500">
                Adjust Settings
              </Button>
            </div>
          </div>

          {/* Right Column - Preview and Actions */}
          <div className="md:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-sm text-gray-500">0 image credits</p>
                </div>
                <Button size="sm" variant="outline" className="text-secondary border-secondary">
                  + Buy Image Credits
                </Button>
              </div>
              
              <Card className="bg-white">
                <CardContent className="p-4">
                  {generatedContent ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          CO
                        </div>
                        <div>
                          <p className="font-medium">Christopher Obeng</p>
                          <p className="text-xs text-gray-500">2 mins ago</p>
                        </div>
                      </div>
                      
                      <div>
                        <pre className="whitespace-pre-wrap font-sans text-sm">
                          {generatedContent}
                        </pre>
                      </div>
                      
                      <div className="flex items-center text-gray-500 text-sm space-x-4">
                        <div className="flex items-center">
                          <span>1.2k likes</span>
                        </div>
                        <div>
                          <span>215 comments</span>
                        </div>
                        <div>
                          <span>19 reposts</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                      <Eye className="w-12 h-12 mb-2" />
                      <p>Preview will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={handleRegenerate}
                    disabled={loading}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                  <Button 
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleSchedule}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Post
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default GeneratePostPage;


import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AnalyticsPage = () => {
  // Mock data for charts
  const monthlyEngagement = [
    { month: 'Jan', likes: 240, comments: 120, shares: 40 },
    { month: 'Feb', likes: 300, comments: 150, shares: 70 },
    { month: 'Mar', likes: 320, comments: 180, shares: 90 },
    { month: 'Apr', likes: 380, comments: 220, shares: 110 },
    { month: 'May', likes: 480, comments: 280, shares: 130 },
  ];

  const postTypePerformance = [
    { type: 'How-to', engagement: 85 },
    { type: 'Tips & Tricks', engagement: 72 },
    { type: 'Industry News', engagement: 56 },
    { type: 'Case Studies', engagement: 68 },
    { type: 'Personal Stories', engagement: 93 },
  ];

  const bestPerformingPosts = [
    {
      id: 1,
      title: 'How to Build Your LinkedIn Personal Brand',
      likes: 1100, 
      comments: 203,
      shares: 18,
      impressions: 18500
    },
    {
      id: 2,
      title: '7 Steps to Optimize Your LinkedIn Profile',
      likes: 920, 
      comments: 154,
      shares: 27,
      impressions: 15200
    },
    {
      id: 3,
      title: 'The Future of AI in Content Marketing',
      likes: 876, 
      comments: 132,
      shares: 41,
      impressions: 14300
    }
  ];

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">Analytics</h1>
          <Select defaultValue="last30">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
              <SelectItem value="lastYear">Last Year</SelectItem>
              <SelectItem value="allTime">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24</div>
              <p className="text-xs text-green-500 mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Total Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">5,842</div>
              <p className="text-xs text-green-500 mt-1">↑ 18% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Avg. Likes per Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">243</div>
              <p className="text-xs text-green-500 mt-1">↑ 8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="py-4">
              <CardTitle className="text-sm font-medium text-gray-500">Profile Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">1,287</div>
              <p className="text-xs text-green-500 mt-1">↑ 22% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Engagement</CardTitle>
              <CardDescription>Likes, comments, and shares over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyEngagement}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="likes" stroke="#1E3A8A" strokeWidth={2} />
                  <Line type="monotone" dataKey="comments" stroke="#2DD4BF" strokeWidth={2} />
                  <Line type="monotone" dataKey="shares" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Post Type Performance</CardTitle>
              <CardDescription>Engagement by content category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={postTypePerformance}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="engagement" fill="#2DD4BF" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Best Performing Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Best Performing Posts</CardTitle>
            <CardDescription>Your top posts by total engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Post Title</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Likes</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Comments</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Shares</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Impressions</th>
                  </tr>
                </thead>
                <tbody>
                  {bestPerformingPosts.map((post) => (
                    <tr key={post.id} className="border-b last:border-0">
                      <td className="py-4 px-4">{post.title}</td>
                      <td className="py-4 px-4 text-right">{post.likes}</td>
                      <td className="py-4 px-4 text-right">{post.comments}</td>
                      <td className="py-4 px-4 text-right">{post.shares}</td>
                      <td className="py-4 px-4 text-right">{post.impressions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default AnalyticsPage;

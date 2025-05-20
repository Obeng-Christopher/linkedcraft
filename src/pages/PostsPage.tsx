
import React from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Search, Trash } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const PostsPage = () => {
  // Mock data for posts
  const posts = [
    {
      id: 1,
      title: "How to Build Your LinkedIn Personal Brand",
      status: "published",
      date: "May 19, 2025, 11:00 AM",
      engagement: {
        likes: 1100,
        comments: 203,
        shares: 18
      },
      excerpt: "Establishing a strong presence on LinkedIn is essential for professionals today. Here are a few practical steps to stand out and grow your network..."
    },
    {
      id: 2,
      title: "Upcoming Product Launch: What to Expect",
      status: "scheduled",
      date: "May 23, 2025, 09:00 AM",
      engagement: {
        likes: 864,
        comments: 110,
        shares: 9
      },
      excerpt: "We're excited to announce our upcoming launch! Stay tuned for exclusive insights and the first look at our new features..."
    },
    {
      id: 3,
      title: "7 Steps to Optimize Your LinkedIn Profile",
      status: "draft",
      date: "",
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0
      },
      excerpt: "Your LinkedIn profile is your digital business card. In these 7 steps, discover how to make your profile more discoverable and attractive for opportunities..."
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success">Published</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="text-warning border-warning">Scheduled</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-gray-500">Draft</Badge>;
      default:
        return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Your Posts</h1>
          <span className="text-sm text-gray-500">24 posts</span>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center w-full sm:w-auto">
            <Checkbox id="selectAll" className="mr-2" />
            <label htmlFor="selectAll" className="text-sm mr-4">Select All</label>
            
            <Button variant="outline" size="sm" className="mr-2">
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button variant="outline" size="sm" className="bg-secondary/10 text-secondary border-secondary">
              <Calendar className="h-4 w-4 mr-1" /> Schedule
            </Button>
          </div>

          <div className="flex flex-1 gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="date">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date Range</SelectItem>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="engagement">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Engagement: High to Low</SelectItem>
                <SelectItem value="engagementAsc">Engagement: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
              />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Post</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead className="w-[180px] text-right">Engagement</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox id={`post-${post.id}`} />
                  </TableCell>
                  <TableCell>
                    <div>
                      <h3 className="font-medium">{post.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell>{post.date || '—'}</TableCell>
                  <TableCell className="text-right">
                    {post.status === 'published' ? (
                      <div className="flex justify-end space-x-3 text-sm">
                        <span>👍 {post.engagement.likes}</span>
                        <span>💬 {post.engagement.comments}</span>
                        <span>🔄 {post.engagement.shares}</span>
                      </div>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="border-t p-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 pl-2">Showing 1-3 of 24 posts</p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PostsPage;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, Search, Trash, Plus } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published';
  scheduled_date?: string | null;
  published_date?: string | null;
  created_at: string;
  topic?: string | null;
  image_url?: string | null;
}

interface PostEngagement {
  likes_count: number;
  comments_count: number;
  reposts_count: number;
}

interface PostWithEngagement extends Post {
  engagement?: PostEngagement;
}

const PAGE_SIZE = 10;

const PostsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [engagementSort, setEngagementSort] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch posts with React Query
  const {
    data: postsData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get engagements for published posts
      const publishedPostIds = posts
        .filter(post => post.status === 'published')
        .map(post => post.id);
      
      let engagements: Record<string, PostEngagement> = {};
      
      if (publishedPostIds.length > 0) {
        const { data: engagementData, error: engagementError } = await supabase
          .from('post_engagements')
          .select('*')
          .in('post_id', publishedPostIds);
        
        if (!engagementError && engagementData) {
          engagements = engagementData.reduce((acc, curr) => {
            acc[curr.post_id] = {
              likes_count: curr.likes_count,
              comments_count: curr.comments_count,
              reposts_count: curr.reposts_count
            };
            return acc;
          }, {} as Record<string, PostEngagement>);
        }
      }
      
      // Combine posts with their engagements
      const postsWithEngagement: PostWithEngagement[] = posts.map(post => ({
        ...post,
        engagement: engagements[post.id] || {
          likes_count: 0,
          comments_count: 0,
          reposts_count: 0
        }
      }));
      
      return {
        posts: postsWithEngagement,
        total: postsWithEngagement.length
      };
    },
    enabled: !!user
  });

  useEffect(() => {
    if (selectAll) {
      setSelectedPosts(filteredPosts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  }, [selectAll]);
  
  // Filter and paginate posts
  const filteredPosts = (postsData?.posts || []).filter(post => {
    // Apply status filter
    if (statusFilter !== 'all' && post.status !== statusFilter) {
      return false;
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const postDate = new Date(post.created_at);
      const now = new Date();
      
      switch (dateFilter) {
        case 'last7':
          const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
          if (postDate < sevenDaysAgo) return false;
          break;
        case 'last30':
          const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
          if (postDate < thirtyDaysAgo) return false;
          break;
        case 'last90':
          const ninetyDaysAgo = new Date(now.setDate(now.getDate() - 90));
          if (postDate < ninetyDaysAgo) return false;
          break;
      }
    }
    
    // Apply search filter
    if (searchTerm && !post.title?.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !post.topic?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Apply engagement sort
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (engagementSort === 'desc') {
      return ((b.engagement?.likes_count || 0) + (b.engagement?.comments_count || 0) + (b.engagement?.reposts_count || 0)) - 
             ((a.engagement?.likes_count || 0) + (a.engagement?.comments_count || 0) + (a.engagement?.reposts_count || 0));
    } else {
      return ((a.engagement?.likes_count || 0) + (a.engagement?.comments_count || 0) + (a.engagement?.reposts_count || 0)) - 
             ((b.engagement?.likes_count || 0) + (b.engagement?.comments_count || 0) + (b.engagement?.reposts_count || 0));
    }
  });
  
  // Paginate posts
  const paginatedPosts = sortedPosts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  
  const handleDeletePosts = async (postIds: string[]) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .in('id', postIds);
        
      if (error) throw error;
      
      toast({
        title: "Posts deleted",
        description: `Successfully deleted ${postIds.length} post${postIds.length > 1 ? 's' : ''}.`
      });
      
      refetch();
      setSelectedPosts([]);
      setSelectAll(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting posts",
        description: error.message || "Failed to delete posts."
      });
    }
  };

  const handlePostSelection = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  };

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Your Posts</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{postsData?.total || 0} posts</span>
            <Button onClick={() => navigate('/generate')} className="bg-primary">
              <Plus className="h-4 w-4 mr-1" /> New Post
            </Button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center w-full sm:w-auto">
            <Checkbox 
              id="selectAll" 
              className="mr-2"
              checked={selectAll}
              onCheckedChange={(checked) => setSelectAll(!!checked)}
            />
            <label htmlFor="selectAll" className="text-sm mr-4">Select All</label>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2"
              disabled={selectedPosts.length === 0}
              onClick={() => handleDeletePosts(selectedPosts)}
            >
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-secondary/10 text-secondary border-secondary"
              disabled={selectedPosts.length === 0}
            >
              <Calendar className="h-4 w-4 mr-1" /> Schedule
            </Button>
          </div>

          <div className="flex flex-1 gap-2 flex-wrap md:flex-nowrap">
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
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

            <Select 
              value={dateFilter} 
              onValueChange={setDateFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
                <SelectItem value="last90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={engagementSort} 
              onValueChange={setEngagementSort}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Engagement: High to Low</SelectItem>
                <SelectItem value="asc">Engagement: Low to High</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading posts...</p>
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <p className="text-red-500">Failed to load posts. Please try again.</p>
              <Button onClick={() => refetch()} variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          ) : paginatedPosts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No posts found.</p>
              {(statusFilter !== 'all' || dateFilter !== 'all' || searchTerm) && (
                <p className="mt-2 text-sm text-gray-400">Try adjusting your filters.</p>
              )}
              <Button 
                onClick={() => navigate('/generate')} 
                className="mt-6 bg-primary"
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Post
              </Button>
            </div>
          ) : (
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
                {paginatedPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <Checkbox 
                        id={`post-${post.id}`} 
                        checked={selectedPosts.includes(post.id)}
                        onCheckedChange={() => handlePostSelection(post.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <h3 className="font-medium">{post.title || post.topic || "Untitled Post"}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{post.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      {post.status === 'published' ? formatDate(post.published_date) : 
                       post.status === 'scheduled' ? formatDate(post.scheduled_date) : 
                       formatDate(post.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      {post.status === 'published' && post.engagement ? (
                        <div className="flex justify-end space-x-3 text-sm">
                          <span>👍 {post.engagement.likes_count}</span>
                          <span>💬 {post.engagement.comments_count}</span>
                          <span>🔄 {post.engagement.reposts_count}</span>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => navigate(`/generate?edit=${post.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeletePosts([post.id])}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {paginatedPosts.length > 0 && (
            <div className="border-t p-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 pl-2">
                  Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredPosts.length)}-
                  {Math.min(currentPage * PAGE_SIZE, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => 
                        page === 1 || 
                        page === totalPages || 
                        Math.abs(page - currentPage) <= 1
                      )
                      .map((page, index, array) => {
                        // Add ellipsis
                        if (index > 0 && page - array[index - 1] > 1) {
                          return (
                            <React.Fragment key={`ellipsis-${page}`}>
                              <PaginationItem>
                                <span className="px-2">...</span>
                              </PaginationItem>
                              <PaginationItem key={page}>
                                <PaginationLink 
                                  onClick={() => setCurrentPage(page)} 
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            </React.Fragment>
                          );
                        }
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink 
                              onClick={() => setCurrentPage(page)} 
                              isActive={page === currentPage}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        className={currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default PostsPage;

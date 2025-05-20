
import React, { useState } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface EventType {
  id: number;
  day: number;
  time: string;
  title: string;
  type: string;
  content?: string;
}

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState('May 2025');
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  
  // Mock data for calendar events with content
  const events: EventType[] = [
    {
      id: 1,
      day: 2,
      time: '08:30',
      title: 'Optimizing LinkedIn Profile',
      type: 'content',
      content: 'In this post, we will discuss the key elements of an optimized LinkedIn profile that attracts recruiters and potential clients. Learn how to craft a compelling headline, write a professional summary, and showcase your experience effectively.'
    },
    {
      id: 2,
      day: 6,
      time: '14:00',
      title: 'Trends Analysis Post',
      type: 'content',
      content: 'Stay ahead of the curve with our detailed analysis of the latest industry trends. This post covers emerging technologies, market shifts, and strategic opportunities you should be aware of this quarter.'
    },
    {
      id: 3,
      day: 6,
      time: '17:00',
      title: 'Grow Network',
      type: 'content',
      content: 'Networking is key to professional growth. This post will share actionable strategies to expand your LinkedIn network authentically, engage with industry leaders, and build meaningful professional relationships.'
    },
    {
      id: 4,
      day: 10,
      time: '10:00',
      title: 'Product Update',
      type: 'content',
      content: "Exciting news! We're launching a new feature that will revolutionize how you manage your content. This post details the benefits, use cases, and how to get started with our latest innovation."
    },
    {
      id: 5,
      day: 10,
      time: '16:30',
      title: 'Creator Tips',
      type: 'content',
      content: 'Transform your LinkedIn content strategy with these proven creator tips. Learn how to increase engagement, optimize post timing, and create content that resonates with your target audience.'
    },
    {
      id: 6,
      day: 13,
      time: '13:00',
      title: 'Engagement Strategies',
      type: 'content',
      content: 'Boost your LinkedIn presence with these engagement strategies. This post covers commenting techniques, content formats that drive interaction, and how to spark meaningful conversations in your professional community.'
    },
    {
      id: 7,
      day: 17,
      time: '15:15',
      title: 'Campaign Plan',
      type: 'content',
      content: 'Develop a winning LinkedIn campaign with our comprehensive planning guide. This post walks through goal setting, audience targeting, content creation, and performance measurement for successful campaigns.'
    }
  ];

  // Generate a calendar grid for May 2025
  const generateCalendar = () => {
    // May 2025 starts on Thursday (4) and has 31 days
    const days = Array(35).fill(null);
    
    // Add days from previous month (April 2025)
    for (let i = 0; i < 4; i++) {
      days[i] = {
        date: 27 + i,
        isCurrentMonth: false
      };
    }
    
    // Add days from current month (May 2025)
    for (let i = 1; i <= 31; i++) {
      days[i + 3] = {
        date: i,
        isCurrentMonth: true,
        events: events.filter(event => event.day === i)
      };
    }
    
    return days;
  };

  const calendar = generateCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const handleEventClick = (event: EventType) => {
    setSelectedEvent(event);
  };

  return (
    <SidebarLayout>
      <div className="h-full flex flex-col">
        <h1 className="text-3xl font-semibold mb-4">Content Calendar</h1>

        {/* Calendar Header */}
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-medium">{currentMonth}</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Select defaultValue="month">
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="View" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="day">Day</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
            
            <Button className="bg-secondary hover:bg-secondary/90">
              <CalendarIcon className="h-4 w-4 mr-2" /> Schedule Post
            </Button>
          </div>
        </div>

        {/* Calendar Grid - Updated to fit available space */}
        <div className="bg-white rounded-md shadow overflow-hidden flex-grow flex flex-col">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day, index) => (
              <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 flex-grow">
            {calendar.map((day, index) => (
              <div 
                key={index} 
                className={`border-r border-b p-2 ${day?.isCurrentMonth ? 'bg-white' : 'bg-gray-50'} overflow-auto`}
              >
                {day && (
                  <>
                    <div className="text-sm font-medium mb-2">
                      {day.date}
                    </div>
                    <div className="space-y-2">
                      {day.events?.map((event) => (
                        <div 
                          key={event.id} 
                          className="bg-primary/5 rounded p-2 text-xs border-l-4 border-primary cursor-pointer hover:bg-primary/10"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="font-semibold text-primary">{event.time} •</div>
                          <div className="font-medium">{event.title}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Post Preview Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{selectedEvent?.title}</span>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              Scheduled for {currentMonth} {selectedEvent?.day}, {selectedEvent?.time}
            </div>
          </DialogHeader>
          
          <div className="p-4 border rounded-md bg-muted/50 max-h-[300px] overflow-y-auto">
            {selectedEvent?.content}
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm">Edit</Button>
            <Button size="sm" className="bg-secondary hover:bg-secondary/90">Reschedule</Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default CalendarPage;

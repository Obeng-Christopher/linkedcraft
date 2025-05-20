
import React, { useState } from 'react';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState('May 2025');
  
  // Mock data for calendar events
  const events = [
    {
      id: 1,
      day: 2,
      time: '08:30',
      title: 'Optimizing LinkedIn Profile',
      type: 'content'
    },
    {
      id: 2,
      day: 6,
      time: '14:00',
      title: 'Trends Analysis Post',
      type: 'content'
    },
    {
      id: 3,
      day: 6,
      time: '17:00',
      title: 'Grow Network',
      type: 'content'
    },
    {
      id: 4,
      day: 10,
      time: '10:00',
      title: 'Product Update',
      type: 'content'
    },
    {
      id: 5,
      day: 10,
      time: '16:30',
      title: 'Creator Tips',
      type: 'content'
    },
    {
      id: 6,
      day: 13,
      time: '13:00',
      title: 'Engagement Strategies',
      type: 'content'
    },
    {
      id: 7,
      day: 17,
      time: '15:15',
      title: 'Campaign Plan',
      type: 'content'
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
    
    // Add days from next month (June 2025)
    for (let i = 0; i < 0; i++) {
      days[i + 35] = {
        date: i + 1,
        isCurrentMonth: false
      };
    }
    
    return days;
  };

  const calendar = generateCalendar();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6">Content Calendar</h1>

        {/* Calendar Header */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
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

        {/* Calendar Grid */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          {/* Week days header */}
          <div className="grid grid-cols-7 border-b">
            {weekDays.map((day, index) => (
              <div key={index} className="py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 h-[800px]">
            {calendar.map((day, index) => (
              <div 
                key={index} 
                className={`border-r border-b p-2 ${day?.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}`}
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
    </SidebarLayout>
  );
};

export default CalendarPage;

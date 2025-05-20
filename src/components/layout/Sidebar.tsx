
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Settings, User, Plus, FileText, ChevronLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import UserProfileFooter from './UserProfileFooter';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Navigation items
  const navItems = [
    {
      name: 'Generate Post',
      path: '/generate',
      icon: <Plus className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Posts',
      path: '/posts',
      icon: <FileText className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Calendar',
      path: '/calendar',
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="h-5 w-5 mr-2" />,
    },
    {
      name: 'User Profile',
      path: '/profile',
      icon: <User className="h-5 w-5 mr-2" />,
    },
  ];

  const isCurrent = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {open && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar - modified to always be visible but with reduced width when collapsed */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
          open ? "w-64" : isMobile ? "w-0" : "w-16",
          open ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          <Link to="/" className="flex items-center" onClick={() => isMobile && setOpen(false)}>
            {open && (
              <h1 className="text-xl font-bold brand-name">
                Linked<span className="text-[#2DD4BF]">Craft</span>
              </h1>
            )}
          </Link>
          
          {/* Only show close button on desktop */}
          {!isMobile && open && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setOpen(false)} 
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => isMobile && setOpen(false)}
            >
              <Button
                variant={isCurrent(item.path) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start mb-1",
                  isCurrent(item.path) 
                    ? "bg-secondary/10 text-secondary hover:bg-secondary/20" 
                    : "hover:bg-gray-100 hover:text-secondary"
                )}
              >
                {item.icon}
                {open && <span>{item.name}</span>}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Footer with upgrade button and user profile */}
        {open && (
          <div className="p-4 border-t border-gray-200">
            <Button className="w-full mb-4 bg-secondary hover:bg-secondary/90 text-white">
              Sign up for Pro
            </Button>
            <div className="flex space-x-2 text-xs text-gray-500 justify-center">
              <Link to="/newsletter" className="hover:text-secondary">Newsletter</Link>
              <span>•</span>
              <Link to="/affiliate" className="hover:text-secondary">Affiliate Program</Link>
            </div>
          </div>
        )}
        
        {open && <UserProfileFooter expanded={true} />}
      </aside>
      
      {/* Collapsed sidebar button to expand - only visible on desktop when sidebar is collapsed */}
      {!open && !isMobile && (
        <div className="fixed z-40 top-4 left-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setOpen(true)}
            className="hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </Button>
        </div>
      )}
    </>
  );
};

export default Sidebar;

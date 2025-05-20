
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Set sidebar to closed by default on mobile only, open on desktop
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true); // Keep sidebar open on desktop by default
    }
  }, [isMobile]); // Only run when isMobile changes, not on every navigation

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${isMobile ? 'ml-0' : (sidebarOpen ? 'ml-64' : 'ml-0')} transition-all duration-300 ease-in-out`}>
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 bg-muted overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;

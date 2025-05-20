
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

interface UserProfileFooterProps {
  expanded: boolean;
}

const UserProfileFooter: React.FC<UserProfileFooterProps> = ({ expanded }) => {
  // In a real app, this would come from authentication state
  const user = {
    name: 'Christopher Obeng',
    initials: 'CO',
    avatar: '/placeholder.svg', // Placeholder avatar
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <Link to="/profile" className="flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        {expanded && (
          <div className="flex-1 truncate">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500">View Profile</p>
          </div>
        )}
      </Link>
    </div>
  );
};

export default UserProfileFooter;

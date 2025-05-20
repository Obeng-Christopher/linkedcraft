
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Redirect to the generate page as the main entry point
  return <Navigate to="/generate" replace />;
};

export default Index;

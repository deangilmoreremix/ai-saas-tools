import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ToolLayout: React.FC<ToolLayoutProps> = ({ title, description, children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/tools" 
        className="inline-flex items-center text-gray-400 hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Tools
      </Link>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-gray-400 mb-8">{description}</p>

        <div className="bg-gray-900 rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToolLayout;
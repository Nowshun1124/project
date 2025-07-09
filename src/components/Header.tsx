import React from 'react';
import { MapPin, Search, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuToggle: () => void;
  onSearchToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onSearchToggle }) => {
  return (
    <header className="bg-white shadow-lg border-b-2 border-orange-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <MapPin className="h-8 w-8 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ヒヨウラ</h1>
              <p className="text-xs text-gray-500">リアルタイム混雑情報</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onSearchToggle}
              className="p-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <Search className="h-5 w-5 text-orange-600" />
            </button>
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-orange-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';
import { Store, CongestionStatus } from '../types';
import { CongestionBadge } from './CongestionBadge';

interface StoreCardProps {
  store: Store;
  congestionStatus?: CongestionStatus;
  onStatusUpdate: (storeId: string, status: 'empty' | 'somewhat-crowded' | 'full') => void;
  onStoreClick: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ 
  store, 
  congestionStatus, 
  onStatusUpdate, 
  onStoreClick 
}) => {
  const handleStatusClick = (e: React.MouseEvent, status: 'empty' | 'somewhat-crowded' | 'full') => {
    e.stopPropagation();
    onStatusUpdate(store.id, status);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
      onClick={() => onStoreClick(store)}
    >
      <div className="relative">
        <img 
          src={store.imageUrl} 
          alt={store.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
            {store.genre}
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{store.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{store.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-gray-400" />
            <span>{store.businessHours}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="h-4 w-4 text-gray-400" />
            <span>{store.priceRange}</span>
          </div>
        </div>
        
        {congestionStatus && (
          <div className="mb-4">
            <CongestionBadge 
              status={congestionStatus.status} 
              timestamp={congestionStatus.timestamp} 
              compact 
            />
          </div>
        )}
        
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            現在の混雑状況を投稿
          </p>
          <div className="flex gap-2">
            <button
              onClick={(e) => handleStatusClick(e, 'empty')}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-green-200"
            >
              😊 空いてる
            </button>
            <button
              onClick={(e) => handleStatusClick(e, 'somewhat-crowded')}
              className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-yellow-200"
            >
              😐 やや混み
            </button>
            <button
              onClick={(e) => handleStatusClick(e, 'full')}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200"
            >
              😰 満席
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
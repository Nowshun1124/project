import React from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Store, CongestionStatus } from '../types';

interface MapViewProps {
  stores: Store[];
  congestionStatuses: CongestionStatus[];
  onStoreClick: (store: Store) => void;
}

export const MapView: React.FC<MapViewProps> = ({ stores, congestionStatuses, onStoreClick }) => {
  const getStatusColor = (storeId: string): string => {
    const status = congestionStatuses.find(s => s.storeId === storeId);
    if (!status) return 'bg-gray-400';
    
    switch (status.status) {
      case 'empty': return 'bg-green-500';
      case 'somewhat-crowded': return 'bg-yellow-500';
      case 'full': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden h-96">
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative">
        {/* Mock map background */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-8 grid-rows-8 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div key={i} className="border border-gray-300"></div>
            ))}
          </div>
        </div>
        
        {/* Center point (user location) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        
        {/* Store markers */}
        {stores.map((store, index) => {
          const angle = (index * 60) * (Math.PI / 180);
          const radius = 80 + (index % 3) * 40;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          return (
            <div
              key={store.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`
              }}
              onClick={() => onStoreClick(store)}
            >
              <div className="relative group">
                <div className={`w-6 h-6 rounded-full ${getStatusColor(store.id)} border-2 border-white shadow-lg hover:scale-110 transition-transform`}>
                  <MapPin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {store.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">混雑状況</h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>空いてる</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>やや混み</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>満席</span>
            </div>
          </div>
        </div>
        
        {/* Navigation button */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-colors">
            <Navigation className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
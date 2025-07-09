import React from 'react';
import { X, MapPin, Clock, DollarSign, Users, Star, Phone } from 'lucide-react';
import { Store, CongestionStatus } from '../types';
import { CongestionBadge } from './CongestionBadge';

interface StoreModalProps {
  store: Store;
  congestionStatus?: CongestionStatus;
  onClose: () => void;
  onStatusUpdate: (storeId: string, status: 'empty' | 'somewhat-crowded' | 'full') => void;
}

export const StoreModal: React.FC<StoreModalProps> = ({ 
  store, 
  congestionStatus, 
  onClose, 
  onStatusUpdate 
}) => {
  const handleStatusClick = (status: 'empty' | 'somewhat-crowded' | 'full') => {
    onStatusUpdate(store.id, status);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="relative">
          <img 
            src={store.imageUrl} 
            alt={store.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              {store.genre}
            </span>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-16rem)]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{store.name}</h2>
            <p className="text-gray-600 mb-4">{store.description}</p>
            
            {congestionStatus && (
              <div className="mb-4">
                <CongestionBadge 
                  status={congestionStatus.status} 
                  timestamp={congestionStatus.timestamp} 
                />
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">住所</p>
                  <p className="text-sm text-gray-600">{store.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">営業時間</p>
                  <p className="text-sm text-gray-600">{store.businessHours}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">価格帯</p>
                  <p className="text-sm text-gray-600">{store.priceRange}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Star className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">評価</p>
                  <p className="text-sm text-gray-600">4.2 ⭐ (128件)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              現在の混雑状況を投稿
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleStatusClick('empty')}
                className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-lg font-medium transition-colors border border-green-200 text-center"
              >
                <div className="text-2xl mb-1">😊</div>
                <div>空いてる</div>
              </button>
              <button
                onClick={() => handleStatusClick('somewhat-crowded')}
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 p-4 rounded-lg font-medium transition-colors border border-yellow-200 text-center"
              >
                <div className="text-2xl mb-1">😐</div>
                <div>やや混み</div>
              </button>
              <button
                onClick={() => handleStatusClick('full')}
                className="bg-red-50 hover:bg-red-100 text-red-700 p-4 rounded-lg font-medium transition-colors border border-red-200 text-center"
              >
                <div className="text-2xl mb-1">😰</div>
                <div>満席</div>
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <div className="flex gap-3">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                <Phone className="h-5 w-5 inline mr-2" />
                電話をかける
              </button>
              <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                <MapPin className="h-5 w-5 inline mr-2" />
                ルート検索
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
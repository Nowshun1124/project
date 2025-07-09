import React from 'react';
import { Trophy, TrendingUp, Clock } from 'lucide-react';
import { Ranking } from '../types';

interface RankingSectionProps {
  rankings: Ranking[];
  onStoreClick: (storeId: string) => void;
}

export const RankingSection: React.FC<RankingSectionProps> = ({ rankings, onStoreClick }) => {
  const getRankingIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1: return <TrendingUp className="h-5 w-5 text-gray-400" />;
      case 2: return <Clock className="h-5 w-5 text-orange-500" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          ヒヨウラ ランキング
        </h2>
        <p className="text-orange-100 text-sm mt-1">今週の人気店舗</p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {rankings.map((ranking, rankingIndex) => (
          <div key={ranking.id} className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {getRankingIcon(rankingIndex)}
              <div>
                <h3 className="font-semibold text-gray-900">{ranking.title}</h3>
                <p className="text-sm text-gray-600">{ranking.description}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {ranking.stores.slice(0, 3).map((store, storeIndex) => (
                <div
                  key={store.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onStoreClick(store.id)}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      storeIndex === 0 ? 'bg-yellow-500' : 
                      storeIndex === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      {storeIndex + 1}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{store.name}</span>
                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                        {store.genre}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{store.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
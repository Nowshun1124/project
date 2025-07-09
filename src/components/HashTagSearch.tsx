import React, { useState } from 'react';
import { Search, X, Hash } from 'lucide-react';
import { HashTag } from '../types';

interface HashTagSearchProps {
  tags: HashTag[];
  selectedTags: string[];
  onTagToggle: (tagId: string) => void;
  onClose: () => void;
}

export const HashTagSearch: React.FC<HashTagSearchProps> = ({ 
  tags, 
  selectedTags, 
  onTagToggle, 
  onClose 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Hash className="h-5 w-5 text-orange-500" />
              気分タグ検索
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="タグを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {filteredTags.map((tag) => (
              <div
                key={tag.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-500'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => onTagToggle(tag.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tag.color }}
                    />
                    <div>
                      <span className="font-medium text-gray-900">{tag.name}</span>
                      <p className="text-sm text-gray-600">{tag.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {tag.count}店舗
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTags.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Hash className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>該当するタグが見つかりませんでした</p>
            </div>
          )}
        </div>
        
        {selectedTags.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              {selectedTags.length}個のタグで検索
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
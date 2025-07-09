import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { StoreCard } from './components/StoreCard';
import { MapView } from './components/MapView';
import { HashTagSearch } from './components/HashTagSearch';
import { RankingSection } from './components/RankingSection';
import { StoreModal } from './components/StoreModal';
import {
  mockStores,
  mockCongestionStatuses,
  mockHashTags,
  mockRankings
} from './data/mockData';
import { Store, CongestionStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MapIcon, List, Hash } from 'lucide-react';

function App() {
  const [congestionStatuses, setCongestionStatuses] = useLocalStorage<CongestionStatus[]>(
    'congestionStatuses',
    mockCongestionStatuses
  );
  const [selectedTags, setSelectedTags] = useLocalStorage<string[]>('selectedTags', []);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const filteredStores = useMemo(() => {
    if (selectedTags.length === 0) return mockStores;

    // Mock filtering logic - in real app, this would query the database
    return mockStores.filter(store => {
      const storeTagNames = getStoreTagNames(store.id);
      return selectedTags.some(tagId => {
        const tag = mockHashTags.find(t => t.id === tagId);
        return tag && storeTagNames.includes(tag.name);
      });
    });
  }, [selectedTags]);

  const handleStatusUpdate = (storeId: string, status: 'empty' | 'somewhat-crowded' | 'full') => {
    const newStatus: CongestionStatus = {
      id: Date.now().toString(),
      storeId,
      status,
      timestamp: new Date().toISOString(),
      userId: 'current-user'
    };

    setCongestionStatuses(prev => {
      const filtered = prev.filter(s => s.storeId !== storeId);
      return [...filtered, newStatus];
    });
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const getStoreTagNames = (storeId: string): string[] => {
    // Mock tag assignment logic
    const tagAssignments: Record<string, string[]> = {
      '1': ['#今日の麺', '#ぼっち飯歓迎', '#コスパ最高'],
      '2': ['#勉強できる', '#サクッとランチ', '#ぼっち飯歓迎'],
      '3': ['#ガッツリ飯', '#深夜まで営業'],
      '4': ['#サクッとランチ', '#テイクアウト可', '#コスパ最高'],
      '5': ['#ぼっち飯歓迎', '#ガッツリ飯', '#コスパ最高'],
      '6': ['#深夜まで営業', '#ガッツリ飯', '#ぼっち飯歓迎']
    };
    return tagAssignments[storeId] || [];
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  const handleRankingStoreClick = (storeId: string) => {
    const store = mockStores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };

  const getStoreCongestionStatus = (storeId: string) => {
    return congestionStatuses.find(status => status.storeId === storeId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
        onSearchToggle={() => setShowSearch(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <List className="h-4 w-4 inline mr-2" />
                リスト
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'map'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <MapIcon className="h-4 w-4 inline mr-2" />
                マップ
              </button>
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                {selectedTags.length}個のタグで絞り込み中
              </span>
              <button
                onClick={() => setSelectedTags([])}
                className="text-sm text-orange-500 hover:text-orange-600 font-medium"
              >
                クリア
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {viewMode === 'map' ? (
              <MapView
                stores={filteredStores}
                congestionStatuses={congestionStatuses}
                onStoreClick={handleStoreClick}
              />
            ) : (
              <div className="space-y-6">
                {filteredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    congestionStatus={getStoreCongestionStatus(store.id)}
                    onStatusUpdate={handleStatusUpdate}
                    onStoreClick={handleStoreClick}
                  />
                ))}

                {filteredStores.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Hash className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      該当する店舗が見つかりませんでした
                    </h3>
                    <p className="text-gray-600">
                      別のタグで検索してみてください
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RankingSection
              rankings={mockRankings}
              onStoreClick={handleRankingStoreClick}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      {showSearch && (
        <HashTagSearch
          tags={mockHashTags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
          onClose={() => setShowSearch(false)}
        />
      )}

      {selectedStore && (
        <StoreModal
          store={selectedStore}
          congestionStatus={getStoreCongestionStatus(selectedStore.id)}
          onClose={() => setSelectedStore(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

export default App;
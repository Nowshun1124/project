import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { Header } from './components/Header';
import { StoreCard } from './components/StoreCard';
import { MapView } from './components/MapView';
import { HashTagSearch } from './components/HashTagSearch';
import { RankingSection } from './components/RankingSection';
import { StoreModal } from './components/StoreModal';
import { AuthModal } from './components/AuthModal';
import { mockRankings } from './data/mockData';
import { Store } from './types';
import { useSupabaseData } from './hooks/useSupabaseData';
import { getCurrentUser } from './lib/supabase';
import { MapIcon, List, Hash } from 'lucide-react';

function App() {
  const {
    stores,
    congestionStatuses,
    hashTags,
    loading,
    error,
    updateCongestionStatus,
    getStoresByTags
  } = useSupabaseData();
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);

  useEffect(() => {
    const checkUser = async () => {
      const { user } = await getCurrentUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const filterStores = async () => {
      if (selectedTags.length === 0) {
        setFilteredStores(stores);
      } else {
        const filtered = await getStoresByTags(selectedTags);
        setFilteredStores(filtered);
      }
    };
    filterStores();
  }, [selectedTags, stores, getStoresByTags]);

  const handleStatusUpdate = async (storeId: string, status: 'empty' | 'somewhat-crowded' | 'full') => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    try {
      await updateCongestionStatus(storeId, status);
    } catch (error) {
      console.error('Failed to update congestion status:', error);
      alert('混雑状況の更新に失敗しました。もう一度お試しください。');
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleStoreClick = (store: Store) => {
    setSelectedStore(store);
  };

  const handleRankingStoreClick = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    if (store) {
      setSelectedStore(store);
    }
  };

  const getStoreCongestionStatus = (storeId: string) => {
    return congestionStatuses.find(status => status.storeId === storeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">エラーが発生しました: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

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
          tags={hashTags}
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

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          window.location.reload();
        }}
      />
    </div>
  );
}

export default App;
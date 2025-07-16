import { useState, useEffect } from 'react';
import { storeService } from '../services/storeService';
import { congestionService } from '../services/congestionService';
import { tagService } from '../services/tagService';
import { Store, CongestionStatus, HashTag } from '../types';

export const useSupabaseData = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [congestionStatuses, setCongestionStatuses] = useState<CongestionStatus[]>([]);
  const [hashTags, setHashTags] = useState<HashTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [storesData, congestionData, tagsData] = await Promise.all([
        storeService.getStores(),
        congestionService.getLatestCongestionStatuses(),
        tagService.getTags()
      ]);

      setStores(storesData);
      setCongestionStatuses(congestionData);
      setHashTags(tagsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateCongestionStatus = async (
    storeId: string, 
    status: 'empty' | 'somewhat-crowded' | 'full'
  ) => {
    try {
      const newStatus = await congestionService.updateCongestionStatus(storeId, status);
      
      // Update local state
      setCongestionStatuses(prev => {
        const filtered = prev.filter(s => s.storeId !== storeId);
        return [...filtered, newStatus];
      });
    } catch (err) {
      console.error('Error updating congestion status:', err);
      throw err;
    }
  };

  const getStoresByTags = async (tagIds: string[]): Promise<Store[]> => {
    if (tagIds.length === 0) return stores;

    try {
      const storesByTag = await Promise.all(
        tagIds.map(tagId => storeService.getStoresByTag(tagId))
      );

      // Get unique stores that match any of the selected tags
      const uniqueStores = new Map<string, Store>();
      storesByTag.flat().forEach(store => {
        uniqueStores.set(store.id, store);
      });

      return Array.from(uniqueStores.values());
    } catch (err) {
      console.error('Error filtering stores by tags:', err);
      return stores;
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to real-time updates
    const subscription = congestionService.subscribeToUpdates((payload) => {
      const newStatus: CongestionStatus = {
        id: payload.new.id,
        storeId: payload.new.store_id,
        status: payload.new.status,
        timestamp: payload.new.created_at,
        userId: payload.new.user_id
      };

      setCongestionStatuses(prev => {
        const filtered = prev.filter(s => s.storeId !== newStatus.storeId);
        return [...filtered, newStatus];
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    stores,
    congestionStatuses,
    hashTags,
    loading,
    error,
    updateCongestionStatus,
    getStoresByTags,
    refetch: loadData
  };
};
import { supabase } from '../lib/supabase';
import { CongestionStatus } from '../types';

export const congestionService = {
  // Get latest congestion status for all stores
  async getLatestCongestionStatuses(): Promise<CongestionStatus[]> {
    const { data, error } = await supabase
      .rpc('get_latest_congestion_statuses');

    if (error) {
      console.error('Error fetching congestion statuses:', error);
      throw error;
    }

    return data.map(status => ({
      id: `${status.store_id}-${status.created_at}`,
      storeId: status.store_id,
      status: status.status,
      timestamp: status.created_at,
      userId: status.user_id
    }));
  },

  // Get congestion status for a specific store
  async getStoreCongestionStatus(storeId: string): Promise<CongestionStatus | null> {
    const { data, error } = await supabase
      .from('congestion_statuses')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No status found
      }
      console.error('Error fetching store congestion status:', error);
      throw error;
    }

    return {
      id: data.id,
      storeId: data.store_id,
      status: data.status,
      timestamp: data.created_at,
      userId: data.user_id
    };
  },

  // Update congestion status
  async updateCongestionStatus(
    storeId: string, 
    status: 'empty' | 'somewhat-crowded' | 'full'
  ): Promise<CongestionStatus> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to update congestion status');
    }

    const { data, error } = await supabase
      .from('congestion_statuses')
      .insert({
        store_id: storeId,
        status,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating congestion status:', error);
      throw error;
    }

    return {
      id: data.id,
      storeId: data.store_id,
      status: data.status,
      timestamp: data.created_at,
      userId: data.user_id
    };
  },

  // Get congestion history for a store
  async getCongestionHistory(storeId: string, limit: number = 10): Promise<CongestionStatus[]> {
    const { data, error } = await supabase
      .from('congestion_statuses')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching congestion history:', error);
      throw error;
    }

    return data.map(status => ({
      id: status.id,
      storeId: status.store_id,
      status: status.status,
      timestamp: status.created_at,
      userId: status.user_id
    }));
  },

  // Subscribe to real-time congestion updates
  subscribeToUpdates(callback: (payload: any) => void) {
    return supabase
      .channel('congestion_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'congestion_statuses'
        },
        callback
      )
      .subscribe();
  }
};
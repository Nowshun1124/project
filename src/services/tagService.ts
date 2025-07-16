import { supabase } from '../lib/supabase';
import { HashTag } from '../types';

export const tagService = {
  // Get all tags with store counts
  async getTags(): Promise<HashTag[]> {
    const { data, error } = await supabase.rpc('get_tag_counts');

    if (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }

    // Get tag details
    const { data: tagDetails, error: tagError } = await supabase
      .from('hash_tags')
      .select('*');

    if (tagError) {
      console.error('Error fetching tag details:', error);
      throw tagError;
    }

    return tagDetails.map(tag => {
      const countData = data.find(item => item.tag_id === tag.id);
      return {
        id: tag.id,
        name: tag.name,
        description: tag.description,
        color: tag.color,
        count: Number(countData?.store_count || 0)
      };
    });
  },

  // Get tags for a specific store
  async getStoreTags(storeId: string): Promise<HashTag[]> {
    const { data, error } = await supabase
      .from('store_tags')
      .select(`
        hash_tags (
          id,
          name,
          description,
          color,
          created_at
        )
      `)
      .eq('store_id', storeId);

    if (error) {
      console.error('Error fetching store tags:', error);
      throw error;
    }

    return data
      .filter(item => item.hash_tags)
      .map(item => {
        const tag = item.hash_tags!;
        return {
          id: tag.id,
          name: tag.name,
          description: tag.description,
          color: tag.color,
          count: 0 // Will be populated separately if needed
        };
      });
  },

  // Add tag to store
  async addTagToStore(storeId: string, tagId: string): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to add tags');
    }

    const { error } = await supabase
      .from('store_tags')
      .insert({
        store_id: storeId,
        tag_id: tagId,
        user_id: user.id
      });

    if (error && error.code !== '23505') { // Ignore duplicate key errors
      console.error('Error adding tag to store:', error);
      throw error;
    }
  },

  // Remove tag from store
  async removeTagFromStore(storeId: string, tagId: string): Promise<void> {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      throw new Error('User must be authenticated to remove tags');
    }

    const { error } = await supabase
      .from('store_tags')
      .delete()
      .eq('store_id', storeId)
      .eq('tag_id', tagId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error removing tag from store:', error);
      throw error;
    }
  }
};
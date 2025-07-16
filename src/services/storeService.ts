import { supabase } from '../lib/supabase';
import { Store } from '../types';

export const storeService = {
  // Get all stores
  async getStores(): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stores:', error);
      throw error;
    }

    return data.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      genre: store.genre,
      businessHours: store.business_hours,
      priceRange: store.price_range,
      latitude: store.latitude,
      longitude: store.longitude,
      imageUrl: store.image_url,
      description: store.description || '',
      createdAt: store.created_at,
      updatedAt: store.updated_at
    }));
  },

  // Get store by ID
  async getStoreById(id: string): Promise<Store | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Store not found
      }
      console.error('Error fetching store:', error);
      throw error;
    }

    return {
      id: data.id,
      name: data.name,
      address: data.address,
      genre: data.genre,
      businessHours: data.business_hours,
      priceRange: data.price_range,
      latitude: data.latitude,
      longitude: data.longitude,
      imageUrl: data.image_url,
      description: data.description || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // Get stores by genre
  async getStoresByGenre(genre: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('genre', genre)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching stores by genre:', error);
      throw error;
    }

    return data.map(store => ({
      id: store.id,
      name: store.name,
      address: store.address,
      genre: store.genre,
      businessHours: store.business_hours,
      priceRange: store.price_range,
      latitude: store.latitude,
      longitude: store.longitude,
      imageUrl: store.image_url,
      description: store.description || '',
      createdAt: store.created_at,
      updatedAt: store.updated_at
    }));
  },

  // Get stores by tag
  async getStoresByTag(tagId: string): Promise<Store[]> {
    const { data, error } = await supabase
      .from('store_tags')
      .select(`
        stores (
          id,
          name,
          address,
          genre,
          business_hours,
          price_range,
          latitude,
          longitude,
          image_url,
          description,
          created_at,
          updated_at
        )
      `)
      .eq('tag_id', tagId);

    if (error) {
      console.error('Error fetching stores by tag:', error);
      throw error;
    }

    return data
      .filter(item => item.stores)
      .map(item => {
        const store = item.stores!;
        return {
          id: store.id,
          name: store.name,
          address: store.address,
          genre: store.genre,
          businessHours: store.business_hours,
          priceRange: store.price_range,
          latitude: store.latitude,
          longitude: store.longitude,
          imageUrl: store.image_url,
          description: store.description || '',
          createdAt: store.created_at,
          updatedAt: store.updated_at
        };
      });
  }
};
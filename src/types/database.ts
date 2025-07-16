export interface Database {
  public: {
    Tables: {
      stores: {
        Row: {
          id: string;
          name: string;
          address: string;
          genre: string;
          business_hours: string;
          price_range: string;
          latitude: number;
          longitude: number;
          image_url: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          genre: string;
          business_hours: string;
          price_range: string;
          latitude: number;
          longitude: number;
          image_url: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          genre?: string;
          business_hours?: string;
          price_range?: string;
          latitude?: number;
          longitude?: number;
          image_url?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      congestion_statuses: {
        Row: {
          id: string;
          store_id: string;
          status: 'empty' | 'somewhat-crowded' | 'full';
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          status: 'empty' | 'somewhat-crowded' | 'full';
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          status?: 'empty' | 'somewhat-crowded' | 'full';
          user_id?: string;
          created_at?: string;
        };
      };
      hash_tags: {
        Row: {
          id: string;
          name: string;
          description: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          color?: string;
          created_at?: string;
        };
      };
      store_tags: {
        Row: {
          id: string;
          store_id: string;
          tag_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          store_id: string;
          tag_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          store_id?: string;
          tag_id?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_latest_congestion_statuses: {
        Args: {};
        Returns: {
          store_id: string;
          status: 'empty' | 'somewhat-crowded' | 'full';
          created_at: string;
          user_id: string;
        }[];
      };
      get_tag_counts: {
        Args: {};
        Returns: {
          tag_id: string;
          tag_name: string;
          store_count: number;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
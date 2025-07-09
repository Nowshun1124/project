export interface Store {
  id: string;
  name: string;
  address: string;
  genre: string;
  businessHours: string;
  priceRange: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CongestionStatus {
  id: string;
  storeId: string;
  status: 'empty' | 'somewhat-crowded' | 'full';
  timestamp: string;
  userId: string;
  store?: Store;
}

export interface HashTag {
  id: string;
  name: string;
  description: string;
  color: string;
  count: number;
}

export interface StoreTag {
  id: string;
  storeId: string;
  tagId: string;
  userId: string;
  createdAt: string;
  store?: Store;
  tag?: HashTag;
}

export interface Ranking {
  id: string;
  title: string;
  description: string;
  stores: Store[];
  period: 'daily' | 'weekly' | 'monthly';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
}
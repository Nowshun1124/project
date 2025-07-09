import { Store, CongestionStatus, HashTag, Ranking } from '../types';

export const mockStores: Store[] = [
  {
    id: '1',
    name: 'らーめん太郎',
    address: '神奈川県横浜市港北区日吉本町1-5-26',
    genre: 'ラーメン',
    businessHours: '11:00-22:00',
    priceRange: '¥500-¥1,000',
    latitude: 35.5555,
    longitude: 139.6503,
    imageUrl: 'https://images.pexels.com/photos/884600/pexels-photo-884600.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '昔ながらの醤油ラーメンが自慢の老舗店',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'カフェ・ド・ヒヨシ',
    address: '神奈川県横浜市港北区日吉本町1-3-15',
    genre: 'カフェ',
    businessHours: '8:00-20:00',
    priceRange: '¥300-¥1,500',
    latitude: 35.5557,
    longitude: 139.6501,
    imageUrl: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '落ち着いた雰囲気で勉強にも最適',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '焼肉キング',
    address: '神奈川県横浜市港北区日吉本町1-7-8',
    genre: '焼肉',
    businessHours: '17:00-24:00',
    priceRange: '¥2,000-¥4,000',
    latitude: 35.5553,
    longitude: 139.6505,
    imageUrl: 'https://images.pexels.com/photos/1633525/pexels-photo-1633525.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'コスパ抜群の焼肉食べ放題',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'サクッと弁当',
    address: '神奈川県横浜市港北区日吉本町1-2-3',
    genre: '弁当',
    businessHours: '6:00-22:00',
    priceRange: '¥300-¥800',
    latitude: 35.5559,
    longitude: 139.6499,
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '忙しい学生にぴったりの手作り弁当',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    name: 'ひとり飯の店',
    address: '神奈川県横浜市港北区日吉本町1-9-12',
    genre: '定食',
    businessHours: '11:00-23:00',
    priceRange: '¥600-¥1,200',
    latitude: 35.5551,
    longitude: 139.6507,
    imageUrl: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '一人でも気軽に入れる定食屋',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: '夜更かし食堂',
    address: '神奈川県横浜市港北区日吉本町1-4-7',
    genre: '居酒屋',
    businessHours: '18:00-3:00',
    priceRange: '¥1,000-¥3,000',
    latitude: 35.5556,
    longitude: 139.6502,
    imageUrl: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: '深夜まで営業の学生御用達店',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

export const mockCongestionStatuses: CongestionStatus[] = [
  {
    id: '1',
    storeId: '1',
    status: 'empty',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    userId: 'user1'
  },
  {
    id: '2',
    storeId: '2',
    status: 'somewhat-crowded',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    userId: 'user2'
  },
  {
    id: '3',
    storeId: '3',
    status: 'full',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userId: 'user3'
  },
  {
    id: '4',
    storeId: '4',
    status: 'empty',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    userId: 'user4'
  },
  {
    id: '5',
    storeId: '5',
    status: 'somewhat-crowded',
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    userId: 'user5'
  },
  {
    id: '6',
    storeId: '6',
    status: 'empty',
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    userId: 'user6'
  }
];

export const mockHashTags: HashTag[] = [
  { id: '1', name: '#ガッツリ飯', description: 'ボリューム満点の食事', color: '#FF6B35', count: 25 },
  { id: '2', name: '#サクッとランチ', description: '素早く食べられるランチ', color: '#4ECDC4', count: 18 },
  { id: '3', name: '#今日の麺', description: 'ラーメン・うどん・そば', color: '#6C5CE7', count: 22 },
  { id: '4', name: '#ぼっち飯歓迎', description: '一人でも入りやすい', color: '#A8E6CF', count: 31 },
  { id: '5', name: '#深夜まで営業', description: '夜遅くまで開いている', color: '#FFD93D', count: 12 },
  { id: '6', name: '#勉強できる', description: '勉強スペースあり', color: '#FF8B94', count: 16 },
  { id: '7', name: '#コスパ最高', description: '値段が安くて美味しい', color: '#B4E7CE', count: 28 },
  { id: '8', name: '#テイクアウト可', description: '持ち帰り可能', color: '#C7CEEA', count: 20 }
];

export const mockRankings: Ranking[] = [
  {
    id: '1',
    title: '今週最も空いてる店',
    description: '「空いてる」投稿が多かった店舗',
    stores: [mockStores[0], mockStores[3], mockStores[5]],
    period: 'weekly',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '#ガッツリ飯で人気',
    description: 'ボリューム満点で学生に人気',
    stores: [mockStores[2], mockStores[0], mockStores[4]],
    period: 'weekly',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '#ぼっち飯歓迎の店',
    description: '一人でも気軽に入れる店舗',
    stores: [mockStores[4], mockStores[1], mockStores[3]],
    period: 'weekly',
    createdAt: new Date().toISOString()
  }
];
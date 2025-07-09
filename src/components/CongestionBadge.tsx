import React from 'react';
import { Clock } from 'lucide-react';

interface CongestionBadgeProps {
  status: 'empty' | 'somewhat-crowded' | 'full';
  timestamp: string;
  compact?: boolean;
}

export const CongestionBadge: React.FC<CongestionBadgeProps> = ({
  status,
  timestamp,
  compact = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'empty':
        return {
          label: '空いてる',
          color: 'bg-green-100 text-green-800 border-green-200',
          emoji: '😊'
        };
      case 'somewhat-crowded':
        return {
          label: 'やや混み',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          emoji: '😐'
        };
      case 'full':
        return {
          label: '満席',
          color: 'bg-red-100 text-red-800 border-red-200',
          emoji: '😰'
        };
      default:
        return {
          label: '不明',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          emoji: '❓'
        };
    }
  };

  const config = getStatusConfig();
  const timeAgo = getTimeAgo(timestamp);

  return (
    <div className={`inline-flex items-center gap-2 ${compact ? 'text-sm' : 'text-base'}`}>
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border font-medium ${config.color}`}>
        <span>{config.emoji}</span>
        <span>{config.label}</span>
      </span>
      <span className="inline-flex items-center gap-1 text-gray-500 text-sm">
        <Clock className="h-3 w-3" />
        <span>{timeAgo}</span>
      </span>
    </div>
  );
};

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return 'たった今';
  if (diffInMinutes < 60) return `${diffInMinutes}分前`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}時間前`;
  return `${Math.floor(diffInMinutes / 1440)}日前`;
}
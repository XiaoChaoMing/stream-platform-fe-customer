/**
 * Interfaces for livestream functionality
 */

// Base livestream interface
export interface ILivestream {
  stream_id: number;
  user_id: number;
  title: string;
  description: string;
  stream_url: string;
  view_count: number;
  thumbnail_url: string | null;
  start_time: string;
  end_time: string | null;
  status: 'live' | 'ended' | 'scheduled';
  user: {
    username: string;
    avatar: string | null;
  };
}

// Request filter for livestreams
export interface ILivestreamFilter {
  page?: number;
  limit?: number;
  status?: 'live' | 'ended' | 'scheduled';
} 
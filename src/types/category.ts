export interface Category {
  id: string;
  name: string;
  imageUrl: string;
  viewersCount: number;
  followersCount: number;
  tags: Tag[];
  description: string;
}

export interface Tag {
  id: string;
  name: string;
  url: string;
}

export interface Stream {
  id: string;
  title: string;
  user: StreamUser;
  language: string;
  tags: string[];
  viewerCount: number;
  thumbnailUrl: string;
  isLive: boolean;
}

export interface StreamUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  isVerified: boolean;
} 
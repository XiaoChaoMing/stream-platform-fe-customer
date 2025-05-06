export interface IProfile {
  id?: string | number;
  username?: string;
  email?: string;
  avatar?: string;
  name: string;
  description: string;
  banner_url: string;
  social_links: Record<string, string>;
  created_at?: string;
  updated_at?: string;
}

export interface IUpdateProfileRequest {
  username?: string;
  email?: string;
  avatar?: string;
  name?: string;
  description?: string;
  banner_url?: string;
  social_links?: Record<string, string>;
}

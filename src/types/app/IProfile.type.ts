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

// New interface for file upload form data - now without username and email
export interface IUpdateProfileWithFilesRequest {
  name?: string;
  description?: string;
  social_links?: string; // Needs to be stringified for FormData
  avatarFile?: File;
  bannerFile?: File;
}

// export interface IChannel {
//   id: string;
//   name: string;
//   avatar: string;
//   description: string;
//   category: string;
//   tags: string[];
//   createdAt: string;
//   updatedAt: string;
// }

// export const DefaultChannel: IChannel = {
//   id: "",
//   name: "",
//   avatar: "",
//   description: "",
//   category: "",
//   tags: [],
//   createdAt: "",
//   updatedAt: ""
// };

export interface IChannel {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  role_id: number;
  stream_link?: string | null;
  thumbnail_url?: string | null;
  donates_link?: string | null;
  
  // Profile related fields
  profile?: {
    name: string;
    description: string | null;
    banner_url: string | null;
    social_links?: Record<string, string>;
  };
  
  // Additional fields for the application context
  is_live?: boolean;
  tags?: string[];
}

export const DefaultChannel: IChannel = {
  id: "",
  username: "",
  email: "",
  avatar: null,
  role_id: 0,

  profile: {
    name: "",
    description: null,
    banner_url: null,
    social_links: {}
  },
  is_live: false,
  tags: []
};
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
  thumbnail_url?: string | null;
  donates_link?: string | null;
  livestream?: {
    stream_id: number;
    user_id: number;
    title: string;
    description: string;
    stream_url: string;
    view_count: number;
    thumbnail_url: string | null;
    start_time: string;
    end_time: string | null;
    status: string;
  }
  // Profile related fields
  profile?: {
    name: string;
    description: string | null;
    banner_url: string | null;
    social_links?: Record<string, string>;
  };
  
  // Additional fields for the application context

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
  livestream: {
    stream_id: 1,
    user_id: 3,
    title: "test",
    description: "stream",
    stream_url: "https://hls.streamify.id.vn/hls/live/Ip5pPBIZ89JW.m3u8",
    view_count: 0,
    thumbnail_url: null,
    start_time: "2024-03-26T10:00:00.000Z",
    end_time: null,
    status: "live"
  },
  tags: []
};
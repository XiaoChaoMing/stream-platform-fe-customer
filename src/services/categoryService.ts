import { Category, Stream } from "@/types/category";

export const fetchCategories = async (): Promise<Category[]> => {
  // This would be replaced with an actual API call
  return [
    {
      id: "counter-strike",
      name: "Counter-Strike",
      imageUrl: "https://static-cdn.jtvnw.net/ttv-boxart/32399-144x192.jpg",
      viewersCount: 28200,
      followersCount: 38100000,
      tags: [
        { id: "fps", name: "FPS", url: "/directory/tags/a69f7ffb-ddda-4c05-8d7d-f0b24975a2c3" },
        { id: "shooter", name: "Shooter", url: "/directory/tags/523fe736-fa95-44c7-b22f-13008ca2172c" },
        { id: "action", name: "Action", url: "/directory/tags/4d1eaa36-f750-4862-b7e9-d0a13970d535" }
      ],
      description: "Counter-Strike has been the pioneering tactical shooter since the franchise debuted in November 2000. This legacy continues with Counter-Strike: Global Offensive and the upcoming release of CS2."
    },
    {
      id: "league-of-legends",
      name: "League of Legends",
      imageUrl: "https://static-cdn.jtvnw.net/ttv-boxart/21779-144x192.jpg",
      viewersCount: 85000,
      followersCount: 45000000,
      tags: [
        { id: "moba", name: "MOBA", url: "/directory/tags/moba" },
        { id: "strategy", name: "Strategy", url: "/directory/tags/strategy" },
        { id: "action", name: "Action", url: "/directory/tags/action" }
      ],
      description: "League of Legends is a team-based strategy game where two teams of five powerful champions face off to destroy the other's base."
    },
    {
      id: "valorant",
      name: "VALORANT",
      imageUrl: "https://static-cdn.jtvnw.net/ttv-boxart/516575-144x192.jpg",
      viewersCount: 42000,
      followersCount: 25000000,
      tags: [
        { id: "fps", name: "FPS", url: "/directory/tags/fps" },
        { id: "shooter", name: "Shooter", url: "/directory/tags/shooter" },
        { id: "tactical", name: "Tactical", url: "/directory/tags/tactical" }
      ],
      description: "VALORANT is a character-based 5v5 tactical shooter set on the global stage. Outwit, outplay, and outshine your competition with tactical abilities, precise gunplay, and adaptive teamwork."
    }
  ];
};

export const fetchCategoryById = async (categoryId: string): Promise<Category | null> => {
  const categories = await fetchCategories();
  return categories.find((category) => category.id === categoryId) || null;
};

export const fetchStreamsByCategory = async (categoryId: string): Promise<Stream[]> => {
  // This would be replaced with an actual API call
  if (categoryId === "counter-strike") {
    return [
      {
        id: "stream1",
        title: "🔴SO CLOSE TO 30K ELO PREMIER🔴3K ELO FACEIT NA🔴!CLASH !TRADEIT",
        user: {
          id: "user1",
          username: "coopertv",
          displayName: "coopertv",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/ad218d8c-0156-444d-bc5d-0a7bb1a64834-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: [],
        viewerCount: 1100,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_coopertv-440x248.jpg",
        isLive: true
      },
      {
        id: "stream2",
        title: "Vaxee XE v2 :O | !merch !discord !tradeit",
        user: {
          id: "user2",
          username: "stewie2k",
          displayName: "Stewie2K",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/35f71663-4391-468d-9e96-ac21fc2aa4f4-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: [],
        viewerCount: 1000,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_stewie2k-440x248.jpg",
        isLive: true
      },
      {
        id: "stream3",
        title: "bworp guy",
        user: {
          id: "user3",
          username: "franzj",
          displayName: "FranzJ",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/97119e79-af7e-4cca-aeb9-79b77040605e-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: ["nuke", "scionXB", "cars"],
        viewerCount: 257,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_franzj-440x248.jpg",
        isLive: true
      },
      {
        id: "stream4",
        title: "🔵 STRICTLY VIBES 🔵 ROAD TO LEVEL 10 🔵 !discord",
        user: {
          id: "user4",
          username: "temperrr",
          displayName: "teMpeRRR",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/53b3ed79-3687-4fe4-8757-656166063ab3-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: [],
        viewerCount: 86,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_temperrr-440x248.jpg",
        isLive: true
      },
      {
        id: "stream5",
        title: "🌊WE BACK ON THE FACEIT GRIND🌊!g4skins !tradeit",
        user: {
          id: "user5",
          username: "freakazoid",
          displayName: "Freakazoid",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/0d339175-e175-494e-b238-9037ed6c3626-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: ["WORKOUT", "ADHD", "Competitive", "420"],
        viewerCount: 702,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_freakazoid-440x248.jpg",
        isLive: true
      },
      {
        id: "stream6",
        title: "SNOT FILLS MY NOSE",
        user: {
          id: "user6",
          username: "wounds",
          displayName: "wounds",
          avatarUrl: "https://static-cdn.jtvnw.net/jtv_user_pictures/c663e38d-dfb9-406e-aaf0-19e530d20104-profile_image-50x50.png",
          isVerified: true
        },
        language: "English",
        tags: ["markiplier", "tired", "AuditoryASMR"],
        viewerCount: 130,
        thumbnailUrl: "https://static-cdn.jtvnw.net/previews-ttv/live_user_wounds-440x248.jpg",
        isLive: true
      }
    ];
  }
  
  return [];
}; 
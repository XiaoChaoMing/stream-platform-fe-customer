import { useEffect, useState } from "react";
import Carosel from "@/components/app/carosel/Carosel";
import CategoryCard from "@/components/app/categoryCard/CategoryCard";
import StreamCard from "@/components/app/streamCard/StreamCard";
import MainLayout from "@/layouts/mainLayout";
import { Link } from "react-router-dom";
import { IChannel } from "@/types/app/Ichannel.type";
import { getAllChannels, getRecommendedChannels } from "@/services/app/channel";
import { useStore } from "@/store/useStore";

// Define the stream card data type
interface StreamCardData {
  thumbImg: string;
  state: boolean;
  view: number;
  channel: IChannel;
  streamName: string;
  tag: string[];
  category: string;
}

const Home = () => {
  const { user } = useStore();
  const [featuredStreams, setFeaturedStreams] = useState<StreamCardData[]>([]);
  const [liveStreams, setLiveStreams] = useState<StreamCardData[]>([]);
  const [recommendedStreams, setRecommendedStreams] = useState<StreamCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const carouselItems = [
    {
      id: 1,
      image: "https://picsum.photos/800/400?random=1",
      title: "Featured Movie 1"
    },
    {
      id: 2,
      image: "https://picsum.photos/800/400?random=2",
      title: "Featured Movie 2"
    },
    {
      id: 3,
      image: "https://picsum.photos/800/400?random=3",
      title: "Featured Movie 3"
    },
    {
      id: 4,
      image: "https://picsum.photos/800/400?random=4",
      title: "Featured Movie 4"
    },
    {
      id: 5,
      image: "https://picsum.photos/800/400?random=5",
      title: "Featured Movie 5"
    }
  ];

  // Create mock stream cards based on the updated IChannel interface
  const createMockStreamCards = (channels: IChannel[]): StreamCardData[] => {
    const categories = [
      "Gaming", "Music", "Art", "Food & Drink", "Technology", 
      "Fitness", "Minecraft", "Just Chatting", "Science & Technology", "Talk Shows & Podcasts"
    ];
    
    const tagSets = [
      ["FPS", "Battle Royale", "Ranked"],
      ["Music", "Piano", "Live Performance"],
      ["Art", "Digital Drawing", "Character Design"],
      ["Cooking", "Italian", "Homemade"],
      ["Programming", "Web Dev", "React"],
      ["Fitness", "Workout", "No Equipment"],
      ["Minecraft", "Survival", "Building"],
      ["Just Chatting", "Movies", "Discussion"],
      ["Science", "Space", "Astronomy"],
      ["Podcast", "News", "Discussion"]
    ];
    
    const streamNames = [
      "Late Night Gaming Session",
      "Piano Session - Taking Requests",
      "Digital Art Creation - Character Design",
      "Cooking From Scratch",
      "Building a React App Live",
      "30-Minute Full Body Workout",
      "Minecraft Survival - Day 100",
      "Let's Talk About Movies",
      "Exploring Space Mysteries",
      "Weekly News Roundup"
    ];
    
    return channels.map((channel, index) => {
      const categoryIndex = index % categories.length;
      return {
        thumbImg: `https://picsum.photos/800/400?random=${index + 1}`,
        state: index % 3 !== 2, // 2/3 of streams are live
        view: Math.floor(Math.random() * 20000),
        channel,
        streamName: streamNames[categoryIndex],
        tag: tagSets[categoryIndex],
        category: categories[categoryIndex]
      };
    });
  };

  // Fetch streams data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Get channel data from API
        const channels = await getAllChannels();
        const recommended = await getRecommendedChannels(parseInt(user?.user_id || '0'));
        
        // If we have real data, use it
        if (channels.length > 0) {
          const streamCards = createMockStreamCards(channels);
          setFeaturedStreams(streamCards.slice(0, 5));
          setLiveStreams(streamCards.filter(s => s.state).slice(0, 6));
          
          if (recommended.length > 0) {
            setRecommendedStreams(createMockStreamCards(recommended));
          } else {
            setRecommendedStreams(streamCards.slice(5, 10));
          }
        } else {
          // Fallback to mock data if API fails
          console.log("Using fallback mock data");
          const mockChannels: IChannel[] = Array(10).fill(null).map((_, index) => ({
            id: `channel${index + 1}`,
            username: `User${index + 1}`,
            email: `user${index + 1}@example.com`,
            avatar: `https://picsum.photos/200/200?random=${index + 1}`,
            role_id: 1,
            is_live: index % 3 !== 2,
            tags: ["Gaming", "Entertainment"],
            profile: {
              name: `User ${index + 1}`,
              description: `This is user ${index + 1}'s channel`,
              banner_url: null,
              social_links: {}
            }
          }));
          
          const mockStreamCards = createMockStreamCards(mockChannels);
          setFeaturedStreams(mockStreamCards.slice(0, 5));
          setLiveStreams(mockStreamCards.filter(s => s.state).slice(0, 6));
          setRecommendedStreams(mockStreamCards.slice(5, 10));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Create fallback mock data
        const mockChannels: IChannel[] = Array(10).fill(null).map((_, index) => ({
          id: `channel${index + 1}`,
          username: `User${index + 1}`,
          email: `user${index + 1}@example.com`,
          avatar: `https://picsum.photos/200/200?random=${index + 1}`,
          role_id: 1,
          is_live: index % 3 !== 2,
          tags: ["Gaming", "Entertainment"],
          profile: {
            name: `User ${index + 1}`,
            description: `This is user ${index + 1}'s channel`,
            banner_url: null,
            social_links: {}
          }
        }));
        
        const mockStreamCards = createMockStreamCards(mockChannels);
        setFeaturedStreams(mockStreamCards.slice(0, 5));
        setLiveStreams(mockStreamCards.filter(s => s.state).slice(0, 6));
        setRecommendedStreams(mockStreamCards.slice(5, 10));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll">
        <div className="absolute w-full rounded-md bg-[var(--background)] p-2 sm:p-4">
          <Carosel items={carouselItems} />
          
          {/* Featured streams section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-start">Featured Streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-[270px] bg-neutral-800 animate-pulse rounded-md"></div>
                ))
              ) : (
                featuredStreams.map((stream) => (
                  <Link to={`/channel/${stream.channel.username}`} key={`featured-${stream.channel.id}`}>
                    <StreamCard 
                      key={`featured-${stream.channel.id}`}
                      thumbImg={stream.thumbImg}
                      state={stream.state}
                      view={stream.view}
                      channel={stream.channel}
                      streamName={stream.streamName}
                      tag={stream.tag}
                      category={stream.category}
                    />
                </Link>
                ))
              )}
            </div>
          </div>
          
          {/* Live Now section with small cards */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-start">Live Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {isLoading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="h-[90px] bg-neutral-800 animate-pulse rounded-md"></div>
                ))
              ) : (
                liveStreams.map((stream) => (
                  <StreamCard 
                    key={`live-${stream.channel.id}`}
                    thumbImg={stream.thumbImg}
                    state={stream.state}
                    view={stream.view}
                    channel={stream.channel}
                    streamName={stream.streamName}
                    tag={stream.tag}
                    category={stream.category}
                    variant="sm" 
                  />
                ))
              )}
            </div>
          </div>
          
          {/* Category section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-start">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
              <CategoryCard />
            </div>
          </div>
          {/* Recommended channels */}
          <div className="mt-8 mb-10">
            <h2 className="text-xl font-semibold mb-3 text-start">Recommended Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-[270px] bg-neutral-800 animate-pulse rounded-md"></div>
                ))
              ) : (
                recommendedStreams.map((stream) => (
                  <StreamCard 
                    key={`rec-${stream.channel.id}`}
                    thumbImg={stream.thumbImg}
                    state={stream.state}
                    view={stream.view}
                    channel={stream.channel}
                    streamName={stream.streamName}
                    tag={stream.tag}
                    category={stream.category}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

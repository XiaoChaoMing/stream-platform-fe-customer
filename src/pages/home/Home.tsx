import { useEffect, useState } from "react";
import Carosel from "@/components/app/carosel/Carosel";
import CategoryCard from "@/components/app/categoryCard/CategoryCard";
import StreamCard from "@/components/app/streamCard/StreamCard";
import VideoCard from "@/components/app/streamCard/VideoCard";
import MainLayout from "@/layouts/mainLayout";
import { Link, useNavigate } from "react-router-dom";
import { IChannel } from "@/types/app/Ichannel.type";
import { getRecommendedChannels } from "@/services/app/channel";
import { useStore } from "@/store/useStore";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";
import { useLivestreamQuery } from "@/hooks/useLivestreamQuery";
import { useVideoQuery } from "@/hooks/useVideoQuery";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  const [recommendedStreams, setRecommendedStreams] = useState<IChannel[]>([]);
  const [isLoadingRecommended, setIsLoadingRecommended] = useState(true);
  
  // Fetch categories using our hook
  const { categories, isLoadingCategories } = useCategoryQuery();
  
  // Fetch livestreams using our hook
  const { 
    allLivestreams,
    isLoadingAllLivestreams,
  } = useLivestreamQuery();

  // Fetch videos using our hook with pagination
  const {
    allVideos,
    isLoadingAllVideos,
  } = useVideoQuery({ limit: 10, page: 1 });

  // const carouselItems = [
  //   {
  //     id: 1,
  //     image: "https://picsum.photos/800/400?random=1",
  //     title: "Featured Movie 1"
  //   },
  //   {
  //     id: 2,
  //     image: "https://picsum.photos/800/400?random=2",
  //     title: "Featured Movie 2"
  //   },
  //   {
  //     id: 3,
  //     image: "https://picsum.photos/800/400?random=3",
  //     title: "Featured Movie 3"
  //   },
  //   {
  //     id: 4,
  //     image: "https://picsum.photos/800/400?random=4",
  //     title: "Featured Movie 4"
  //   },
  //   {
  //     id: 5,
  //     image: "https://picsum.photos/800/400?random=5",
  //     title: "Featured Movie 5"
  //   }
  // ];

  // Fetch recommended channels
  useEffect(() => {
    const fetchRecommended = async () => {
      setIsLoadingRecommended(true);
      try {
        const recommended = await getRecommendedChannels(parseInt(user?.user_id || '0'));
        setRecommendedStreams(recommended);
      } catch (error) {
        console.error("Error fetching recommended channels:", error);
      } finally {
        setIsLoadingRecommended(false);
      }
    };

    fetchRecommended();
  }, [user?.user_id]);

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll">
        <div className="absolute w-full h-full rounded-md bg-[var(--background)] p-2 sm:p-4">
          {/* <Carosel items={carouselItems} /> */}
          
          {/* Featured streams section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-start">Featured Streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {isLoadingAllLivestreams ? (
                Array(5).fill(0).map((_, i) => (
                  <StreamCard
                    key={i}
                    isLoading={true}
                    channel={{ username: "" }}
                    streamName=""
                  />
                ))
              ) : allLivestreams && allLivestreams.length > 0 ? (
                allLivestreams.slice(0, 5).map((stream) => (
                  <Link to={`/channel/${stream.user_id}`} key={`featured-${stream.stream_id}`}>
                    <StreamCard 
                      key={`featured-${stream.stream_id}`}
                      thumbImg={stream.thumbnail_url || '/placeholder-stream.jpg'}
                      state={stream.status === 'live'}
                      view={stream.view_count}
                      channel={{
                        id: stream.user_id.toString(),
                        username: stream.user.username ||"test" ,
                        avatar: stream.user.avatar || '',
                      }}
                      streamName={stream.title}
                    />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No featured streams available
                </div>
              )}
            </div>
          </div>
          
          {/* Live Now section with small cards */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-start">Live Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {isLoadingAllLivestreams ? (
                Array(6).fill(0).map((_, i) => (
                  <StreamCard
                    key={i}
                    isLoading={true}
                    variant="sm"
                    channel={{ username: "" }}
                    streamName=""
                  />
                ))
              ) : allLivestreams && allLivestreams.length > 0 ? (
                allLivestreams.slice(0, 6).map((stream) => (
                  <Link to={`/channel/${stream.user_id}`} key={`live-${stream.stream_id}`}>
                    <StreamCard 
                      key={`live-${stream.stream_id}`}
                      thumbImg={stream.thumbnail_url || '/placeholder-stream.jpg'}
                      state={stream.status === 'live'}
                      view={stream.view_count}
                      channel={{
                        id: stream.user_id.toString(),
                        username: stream.user.username,
                        avatar: stream.user.avatar || '',
                      }}
                      streamName={stream.title}
                      variant="sm"
                    />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No live streams available
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Videos section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-start">Recent Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {isLoadingAllVideos ? (
                Array(5).fill(0).map((_, i) => (
                  <VideoCard
                    key={i}
                    isLoading={true}
                    video={{
                      video_id: "",
                      thumbnailUrl: "",
                      title: "",
                      duration: "",
                      username: "",
                      views: 0,
                      createdAt: new Date().toISOString()
                    }}
                  />
                ))
              ) : allVideos && allVideos.length > 0 ? (
                allVideos.map((video) => (
                  <VideoCard
                    key={video.video_id}
                    video={{
                      video_id: String(video.video_id),
                      thumbnailUrl: video.thumbnail_url || '',
                      title: video.title,
                      duration: video.duration || '1:00',
                      username: video.user.profile?.name || video.user.username,
                      views: video.view_count || 0,
                      createdAt: video.created_at
                    }}
                    onClick={() => navigate(`/video/${video.video_id}`)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No videos available
                </div>
              )}
            </div>
            {allVideos && allVideos.length > 0 && (
              <div className="mt-3 text-end">
                <Link to="/videos" className="text-primary hover:underline">
                  View All Videos
                </Link>
              </div>
            )}
          </div>
          
          {/* Category section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3 text-start">Browse Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 xl:grid-cols-10 gap-3 sm:gap-4">
              {isLoadingCategories ? (
                Array(10).fill(0).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))
              ) : categories && categories.length > 0 ? (
                categories.slice(0, 10).map((category) => (
                  <Link to={`/category/${category.category_id}`} key={category.category_id}>
                    <CategoryCard category={category} />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No categories available
                </div>
              )}
            </div>
            {categories && categories.length > 0 && (
              <div className="mt-3 text-end">
                <Link to="/category" className="text-primary hover:underline">
                  View All Categories
                </Link>
              </div>
            )}
          </div>
          
          {/* Recommended channels */}
          <div className="mt-8 mb-10">
            <h2 className="text-xl font-semibold mb-3 text-start">Recommended Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {isLoadingRecommended ? (
                Array(5).fill(0).map((_, i) => (
                  <StreamCard
                    key={i}
                    isLoading={true}
                    channel={{ username: "" }}
                    streamName=""
                  />
                ))
              ) : recommendedStreams && recommendedStreams.length > 0 ? (
                recommendedStreams.map((channel) => (
                  <Link to={`/channel/${channel.id}`} key={`rec-${channel.id}`}>
                    <StreamCard 
                      key={`rec-${channel.id}`}
                      thumbImg={channel.thumbnail_url || '/placeholder-stream.jpg'}
                      state={channel.livestream?.status === 'live'}
                      view={channel.livestream?.view_count || 0}
                      channel={{
                        id: channel.id,
                        username: channel.username,
                        avatar: channel.avatar || '',
                      }}
                      streamName={channel.livestream?.title || `${channel.username}'s Channel`}
                    />
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-4 text-muted-foreground">
                  No recommended channels available
                </div>
              )}
            </div>
          </div>
          <div className="h-20"></div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

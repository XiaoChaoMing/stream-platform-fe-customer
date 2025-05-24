import { useLivestreamQuery } from "@/hooks/useLivestreamQuery";
import StreamCard from "@/components/app/streamCard/StreamCard";

const Live = () => {
  const {
    followingLivestreams,
    isLoadingFollowingLivestreams,
    followingLivestreamsError,
  } = useLivestreamQuery();

  if (followingLivestreamsError) {
    return (
      <div className="p-4 text-center text-destructive">
        <p>Error loading livestreams: {(followingLivestreamsError as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Live Channels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoadingFollowingLivestreams && !followingLivestreams?.length ? (
          Array(8).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-lg overflow-hidden shadow">
              <div className="aspect-video bg-muted-foreground/20 animate-pulse"></div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted-foreground/20 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-foreground/20 rounded animate-pulse mb-1"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : followingLivestreams?.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            <p>No live channels found from your following list.</p>
          </div>
        ) : (
          followingLivestreams?.map((stream) => (
            <StreamCard
              key={stream.stream_id}
              thumbImg={stream.thumbnail_url || '/placeholder-stream.jpg'}
              state={stream.status === 'live'?true:false}
              view={stream.view_count}
              channel={{
                id: stream.user_id.toString(),
                username: stream.user.username,
                avatar: stream.user.avatar || '',
              }}
              streamName={stream.title}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Live;

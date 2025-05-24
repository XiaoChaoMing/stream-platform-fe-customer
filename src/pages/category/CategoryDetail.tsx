import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Category, Stream } from "@/types/category";
import { fetchCategoryById, fetchStreamsByCategory } from "@/services/categoryService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StreamCard from "@/components/app/categories/StreamCard";

const CategoryDetailPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("live");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryId) return;

      try {
        setIsLoading(true);
        const categoryData = await fetchCategoryById(categoryId);
        
        if (!categoryData) {
          setError("Category not found");
          return;
        }
        
        setCategory(categoryData);
        
        const streamsData = await fetchStreamsByCategory(categoryId);
        setStreams(streamsData);
        setError(null);
      } catch (err) {
        setError("Failed to load category data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [categoryId]);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    // In a real app, you would call an API to follow/unfollow the category
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2">{error || "Category not found"}</p>
          <Link to="/category">
            <button className="mt-4 rounded-md bg-primary px-4 py-2 text-white">
              Back to Categories
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        <div className="flex-shrink-0">
          <img 
            src={category.imageUrl} 
            alt={category.name} 
            className="h-48 w-36 rounded-md object-cover sm:h-64 sm:w-48" 
          />
        </div>
        
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{category.name}</h1>
          
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span><strong>{category.viewersCount.toLocaleString()}</strong> Viewers</span>
            <span className="text-xs">•</span>
            <span><strong>{category.followersCount > 1000000 
              ? `${(category.followersCount / 1000000).toFixed(1)}M` 
              : `${(category.followersCount / 1000).toFixed(0)}K`}</strong> Followers</span>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            {category.tags.map((tag) => (
              <Link key={tag.id} to={tag.url}>
                <Badge className="cursor-pointer">{tag.name}</Badge>
              </Link>
            ))}
          </div>
          
          <p className="mt-6 text-gray-600">{category.description}</p>
          
          <div className="mt-auto">
            <Button 
              onClick={handleFollowToggle}
              variant={isFollowing ? "outline" : "default"}
              className="mt-4"
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="live" value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList>
          <TabsTrigger value="live">Live Channels</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="clips">Clips</TabsTrigger>
        </TabsList>
        
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
          />
        </div>
        
        <TabsContent value="live" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {streams.length > 0 ? (
              streams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">No live streams available for this category.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="mt-6">
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500">No videos available for this category.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="clips" className="mt-6">
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-500">No clips available for this category.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CategoryDetailPage; 
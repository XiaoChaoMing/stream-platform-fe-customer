import Carosel from "@/components/app/carosel/Carosel";
import CategoryCard from "@/components/app/categoryCard/CategoryCard";
import StreamCard from "@/components/app/streamCard/StreamCard";
import MainLayout from "@/layouts/mainLayout";

const Home = () => {
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

  const mockStreamCards = [
    {
      thumbImg: "https://picsum.photos/800/400?random=1",
      state: true,
      view: 12543,
      channel: {
        id: "channel1",
        name: "ProGamer",
        avatar: "https://picsum.photos/800/400?random=1",
        description:
          "Professional gamer specializing in FPS and Battle Royale games.",
        category: "Gaming",
        tags: ["FPS", "Battle Royale", "Competitive"],
        createdAt: "2022-03-15T14:30:00Z",
        updatedAt: "2024-01-18T09:45:12Z"
      },
      streamName: "Late Night Apex Legends Ranked",
      tag: ["FPS", "Battle Royale", "Ranked"],
      category: "Apex Legends"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=2",
      state: true,
      view: 3872,
      channel: {
        id: "channel2",
        name: "MusicMaster",
        avatar: "https://picsum.photos/800/400?random=2",
        description:
          "Classical pianist sharing music tutorials and performances.",
        category: "Music",
        tags: ["Piano", "Classical", "Live Performance"],
        createdAt: "2021-11-22T18:15:30Z",
        updatedAt: "2023-12-05T22:10:45Z"
      },
      streamName: "Piano Session - Taking Requests",
      tag: ["Music", "Piano", "Live Performance"],
      category: "Music"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=3",
      state: false,
      view: 0,
      channel: {
        id: "channel3",
        name: "ArtistPro",
        avatar: "https://picsum.photos/800/400?random=3",
        description:
          "Digital artist creating character designs and concept art.",
        category: "Art",
        tags: ["Digital Art", "Character Design", "Illustration"],
        createdAt: "2022-05-07T09:20:15Z",
        updatedAt: "2024-02-10T14:30:20Z"
      },
      streamName: "Digital Art Creation - Character Design",
      tag: ["Art", "Digital Drawing", "Character Design"],
      category: "Art"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=4",
      state: true,
      view: 8254,
      channel: {
        id: "channel4",
        name: "ChefExtraordinaire",
        avatar: "https://picsum.photos/800/400?random=4",
        description:
          "Culinary expert sharing authentic Italian recipes and cooking techniques.",
        category: "Food & Drink",
        tags: ["Cooking", "Italian Cuisine", "Recipes"],
        createdAt: "2021-08-12T11:45:30Z",
        updatedAt: "2024-03-01T17:25:10Z"
      },
      streamName: "Cooking Italian Pasta From Scratch",
      tag: ["Cooking", "Italian", "Homemade"],
      category: "Food & Drink"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=5",
      state: true,
      view: 5621,
      channel: {
        id: "channel5",
        name: "TechGeek",
        avatar: "https://picsum.photos/800/400?random=5",
        description:
          "Software developer teaching web development and programming concepts.",
        category: "Technology",
        tags: ["Programming", "Web Development", "React"],
        createdAt: "2022-01-25T15:30:45Z",
        updatedAt: "2024-02-28T10:15:30Z"
      },
      streamName: "Building a React App Live",
      tag: ["Programming", "Web Dev", "React"],
      category: "Software & Development"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=6",
      state: false,
      view: 0,
      channel: {
        id: "channel6",
        name: "FitnessFriend",
        avatar: "https://picsum.photos/800/400?random=6",
        description:
          "Certified fitness trainer providing home workout routines and health tips.",
        category: "Fitness",
        tags: ["Workout", "Health", "Fitness"],
        createdAt: "2021-10-05T08:20:15Z",
        updatedAt: "2023-11-18T19:40:55Z"
      },
      streamName: "30-Minute Full Body Workout",
      tag: ["Fitness", "Workout", "No Equipment"],
      category: "Health & Fitness"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=7",
      state: true,
      view: 15823,
      channel: {
        id: "channel7",
        name: "GameMaster",
        avatar: "https://picsum.photos/800/400?random=7",
        description:
          "Minecraft expert showcasing building techniques and survival strategies.",
        category: "Gaming",
        tags: ["Minecraft", "Building", "Survival"],
        createdAt: "2021-07-18T13:25:40Z",
        updatedAt: "2024-01-05T11:30:20Z"
      },
      streamName: "Minecraft Survival - Day 100",
      tag: ["Minecraft", "Survival", "Building"],
      category: "Minecraft"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=8",
      state: true,
      view: 7432,
      channel: {
        id: "channel8",
        name: "JustChatting",
        avatar: "https://picsum.photos/800/400?random=8",
        description:
          "Movie enthusiast discussing film analysis and entertainment news.",
        category: "Talk Shows",
        tags: ["Movies", "Discussion", "Entertainment"],
        createdAt: "2022-02-14T16:50:30Z",
        updatedAt: "2024-03-10T21:15:40Z"
      },
      streamName: "Let's Talk About Movies",
      tag: ["Just Chatting", "Movies", "Discussion"],
      category: "Just Chatting"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=9",
      state: true,
      view: 4215,
      channel: {
        id: "channel9",
        name: "ScienceExplorer",
        avatar: "https://picsum.photos/800/400?random=9",
        description:
          "Astrophysicist explaining space phenomena and astronomical discoveries.",
        category: "Science",
        tags: ["Astronomy", "Space", "Education"],
        createdAt: "2021-09-30T12:10:25Z",
        updatedAt: "2024-02-15T13:45:50Z"
      },
      streamName: "Exploring Space Mysteries",
      tag: ["Science", "Space", "Astronomy"],
      category: "Science & Technology"
    },
    {
      thumbImg: "https://picsum.photos/800/400?random=10",
      state: false,
      view: 0,
      channel: {
        id: "channel10",
        name: "PodcastHost",
        avatar: "https://picsum.photos/800/400?random=10",
        description:
          "Journalist covering weekly news and current events with expert guests.",
        category: "Podcasts",
        tags: ["News", "Current Events", "Interviews"],
        createdAt: "2022-04-08T10:35:15Z",
        updatedAt: "2024-01-30T18:20:35Z"
      },
      streamName: "Weekly News Roundup",
      tag: ["Podcast", "News", "Discussion"],
      category: "Talk Shows & Podcasts"
    }
  ];

  return (
    <MainLayout>
      <div className="relative h-full w-full overflow-y-scroll">
        <div className="absolute w-full rounded-md bg-[var(--background)] p-2 sm:p-4">
          <Carosel items={carouselItems} />
          
          {/* Featured streams section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Featured Streams</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {mockStreamCards.slice(0, 5).map((c) => (
                <StreamCard key={c.streamName} {...c} />
              ))}
            </div>
          </div>
          
          {/* Live Now section with small cards */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Live Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {mockStreamCards.filter(c => c.state).slice(0, 6).map((c) => (
                <StreamCard key={`live-${c.streamName}`} {...c} variant="sm" />
              ))}
            </div>
          </div>
          
          {/* Category section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Browse Categories</h2>
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
            <h2 className="text-xl font-semibold mb-3">Recommended Channels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {mockStreamCards.slice(5, 10).map((c) => (
                <StreamCard key={`rec-${c.streamName}`} {...c} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

Home.propTypes = {};

export default Home;

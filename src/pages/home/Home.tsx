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

  return (
    <MainLayout>
      <Carosel items={carouselItems} />
      {/* list stream cards */}
      <div className="mt-4 grid grid-cols-5 gap-4">
        <StreamCard />
        <StreamCard />
        <StreamCard />
        <StreamCard />
        <StreamCard />
      </div>
      {/* category cards */}
      <div className="mt-4 grid grid-cols-10 gap-4">
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
    </MainLayout>
  );
};

Home.propTypes = {};

export default Home;

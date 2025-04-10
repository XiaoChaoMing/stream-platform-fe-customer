import categoryImage from "@/assets/32399-188x250.png";
type CategoryCardProps = {
  name: string;
  tag: string[];
  totalView: number;
};
const getRandomBackground = () => {
  const colors = [
    "bg-purple-400",
    "bg-blue-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-pink-400",
    "bg-indigo-400",
    "bg-teal-400",
    "bg-orange-400"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
const CategoryCard = () => {
  const bgColor = getRandomBackground();
  return (
    <div className="flex flex-col gap-2">
      <div className={`group ${bgColor}`}>
        <img
          className="object-cover transition-all duration-300 group-hover:translate-x-[7px] group-hover:translate-y-[-8px]"
          src={categoryImage}
          alt=""
        />
      </div>
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-md font-medium">category name</h1>
        <h1>100k viewer</h1>
        <div className="flex flex-wrap gap-1.5">
          <p className="flex items-center rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
            Game
          </p>
          <p className="flex items-center rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
            English
          </p>
        </div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {};

export default CategoryCard;

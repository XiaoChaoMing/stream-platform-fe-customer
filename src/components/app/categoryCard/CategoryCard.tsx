import categoryImage from "@/assets/32399-188x250.png";
import randomColor from "randomcolor";
type CategoryCardProps = {
  name: string;
  tag: string[];
  totalView: number;
};
const CategoryCard = () => {
  const bgColor = randomColor();
  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <div className="hover-group">
      <div className={`hover-2 group`} style={{ "--c": bgColor ,"--d": "5px" } as React.CSSProperties}>
        <img
          className="object-cover"
          src={categoryImage}
          alt=""
        />
      </div>
      </div>
     
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-md font-medium">category name</h1>
        <h1>100k viewer</h1>
        <div className="flex flex-wrap gap-1.5">
          <p className="flex items-center text-sm rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
            Game
          </p>
          <p className="flex items-center text-sm rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
            English
          </p>
        </div>
      </div>
    </div>
  );
};

CategoryCard.propTypes = {};

export default CategoryCard;

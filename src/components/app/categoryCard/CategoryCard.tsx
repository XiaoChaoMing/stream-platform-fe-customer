import randomColor from "randomcolor";
import { ICategory } from "@/types/app/ICategory.type";
import { FC } from "react";

interface CategoryCardProps {
  category: ICategory;
}

const CategoryCard: FC<CategoryCardProps> = ({ category }) => {
  const bgColor = randomColor();
  
  return (
    <div className="flex flex-col gap-2 cursor-pointer">
      <div className="hover-group">
        <div 
          className={`hover-2 group`} 
          style={{ "--c": bgColor, "--d": "5px" } as React.CSSProperties}
        >
          <img
            className="object-cover w-full h-48"
            src={category.thumbnail_url}
            alt={category.name}
          />
        </div>
      </div>
     
      <div className="flex flex-col items-start gap-1">
        <h1 className="text-md font-medium">{category.name}</h1>
        <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
        
        {/* Tags can be added if present in your category data */}
        <div className="flex flex-wrap gap-1.5 mt-1">
          <p className="flex items-center text-sm rounded-2xl bg-[var(--ring)] px-2 hover:opacity-90">
            Game
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;

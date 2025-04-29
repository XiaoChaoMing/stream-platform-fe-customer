import React from "react";

const Category = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Placeholder for categories - would be populated from an API in real implementation */}
        {Array(18).fill(0).map((_, index) => (
          <div key={index} className="bg-card rounded-lg overflow-hidden shadow cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <div className="aspect-square bg-muted-foreground/20 animate-pulse"></div>
            <div className="p-3">
              <div className="h-4 bg-muted-foreground/20 rounded animate-pulse mb-2"></div>
              <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;

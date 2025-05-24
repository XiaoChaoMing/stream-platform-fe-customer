import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useCategoryQuery } from "@/hooks/useCategoryQuery";
import { useCategoryStore } from "@/store/slices/categorySlice";
import CategoryCard from "@/components/app/categoryCard/CategoryCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const CategoryPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    categories, 
    isLoadingCategories, 
    categoriesError, 
    loadMoreCategories, 
    searchCategories 
  } = useCategoryQuery();
  
  const { hasMore, isLoading, error } = useCategoryStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchCategories(searchTerm);
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || categoriesError) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{t('Error')}</h2>
          <p className="mt-2">{error || (categoriesError as Error)?.message}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4"
            variant="default"
          >
            {t('Retry')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="mb-6 text-3xl font-bold">{t('Browse Categories')}</h1>
      
      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('Search categories...')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">{t('Search')}</Button>
        </div>
      </form>
      
      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {categories?.map((category) => (
          <Link key={category.category_id} to={`/category/${category.category_id}`}>
            <Card className="overflow-hidden p-3 h-full hover:border-primary transition-all">
              <CategoryCard category={category} />
            </Card>
          </Link>
        ))}
      </div>
      
      {/* Load more button */}
      {hasMore && categories && categories.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={loadMoreCategories} 
            variant="outline"
            disabled={isLoadingCategories}
          >
            {isLoadingCategories && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('Load More')}
          </Button>
        </div>
      )}
      
      {/* Empty state */}
      {categories && categories.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-xl font-semibold">{t('No categories found')}</h2>
          <p className="mt-2 text-muted-foreground">
            {t('Try a different search term or check back later.')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage; 
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '@/services/app/category';
import { ICategoryFilter } from '@/types/app/ICategory.type';
import { useCategoryStore } from '@/store/slices/categorySlice';
import { useEffect } from 'react';

/**
 * Hook for managing category-related queries
 */
export const useCategoryQuery = (categoryId?: number) => {
  const queryClient = useQueryClient();
  const { 
    page, 
    limit, 
    search, 
    setCategories, 
    setTotalCount,
    setIsLoading,
    setError 
  } = useCategoryStore();

  // Prepare filter for query
  const filter: ICategoryFilter = {
    page,
    limit,
    search: search || undefined
  };

  /**
   * Get all categories
   */
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories', 'all', filter],
    queryFn: () => categoryService.getAllCategories(filter),
    enabled: true,
  });

  /**
   * Get category by ID
   */
  const {
    data: category,
    isLoading: isLoadingCategory,
    error: categoryError,
    refetch: refetchCategory
  } = useQuery({
    queryKey: ['categories', 'detail', categoryId],
    queryFn: () => categoryId
      ? categoryService.getCategoryById(categoryId)
      : Promise.resolve(null),
    enabled: !!categoryId,
  });

  /**
   * Get total count of categories
   */
  const {
    data: totalCount,
    isLoading: isLoadingCount,
    refetch: refetchCount
  } = useQuery({
    queryKey: ['categories', 'count'],
    queryFn: () => categoryService.getCategoriesCount(),
    enabled: true,
  });

  // Update store when data changes
  useEffect(() => {
    if (categories) {
      setCategories(categories);
    }
  }, [categories, setCategories]);

  useEffect(() => {
    if (totalCount !== undefined) {
      setTotalCount(totalCount);
    }
  }, [totalCount, setTotalCount]);

  useEffect(() => {
    setIsLoading(isLoadingCategories || isLoadingCount);
  }, [isLoadingCategories, isLoadingCount, setIsLoading]);

  useEffect(() => {
    if (categoriesError) {
      setError((categoriesError as Error).message);
    } else {
      setError(null);
    }
  }, [categoriesError, setError]);

  /**
   * Load more categories by incrementing the page
   */
  const loadMoreCategories = () => {
    useCategoryStore.getState().incrementPage();
  };

  /**
   * Reset pagination
   */
  const resetPagination = () => {
    useCategoryStore.getState().resetPage();
  };

  /**
   * Search categories
   */
  const searchCategories = (searchTerm: string) => {
    useCategoryStore.getState().setSearch(searchTerm);
  };

  return {
    // Categories data
    categories,
    isLoadingCategories,
    categoriesError,
    
    // Category detail
    category,
    isLoadingCategory,
    categoryError,
    
    // Count
    totalCount,
    isLoadingCount,
    
    // Actions
    loadMoreCategories,
    resetPagination,
    searchCategories,
    
    // Refetch functions
    refetchCategories,
    refetchCategory,
    refetchCount
  };
}; 
import { BaseService } from '../base/base';
import { ICategory, ICategoryFilter } from '@/types/app/ICategory.type';

class CategoryService extends BaseService {
  constructor() {
    super();
  }

  /**
   * Get all categories
   */
  async getAllCategories(filter?: ICategoryFilter): Promise<ICategory[]> {
    try {
      let url = '/categories';
      
      // Add query parameters if filter is provided
      if (filter) {
        const params = new URLSearchParams();
        if (filter.page) params.append('page', filter.page.toString());
        if (filter.limit) params.append('limit', filter.limit.toString());
        if (filter.search) params.append('search', filter.search);
        
        const queryString = params.toString();
        if (queryString) {
          url = `${url}?${queryString}`;
        }
      }
      
      const response = await this.get<ICategory[]>(url);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: number): Promise<ICategory | null> {
    try {
      const response = await this.get<ICategory>(`/categories/${categoryId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching category with ID ${categoryId}:`, error);
      return null;
    }
  }

  /**
   * Get categories count
   */
  // async getCategoriesCount(): Promise<number> {
  //   try {
  //     const response = await this.get<{ count: number }>('/categories/count');
  //     return response.count;
  //   } catch (error) {
  //     console.error('Error fetching categories count:', error);
  //     return 0;
  //   }
  // }
}

export const categoryService = new CategoryService();

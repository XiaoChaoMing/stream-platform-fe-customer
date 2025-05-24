/**
 * Interfaces for category functionality
 */

// Base category interface
export interface ICategory {
  category_id: number;
  name: string;
  thumbnail_url: string;
  description: string;
}

// Request to get categories with optional filtering
export interface ICategoryFilter {
  page?: number;
  limit?: number;
  search?: string;
}

// Response for category count
export interface ICategoryCountResponse {
  count: number;
}

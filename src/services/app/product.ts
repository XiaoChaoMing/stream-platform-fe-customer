import { BaseService } from "../base/base";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

class ProductService extends BaseService {
  async getProducts(): Promise<Product[]> {
    return this.get<Product[]>("/products");
  }

  async getProduct(id: number): Promise<Product> {
    return this.get<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<string[]> {
    return this.get<string[]>("/products/categories");
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.get<Product[]>(`/products/category/${category}`);
  }
}

export const productService = new ProductService();

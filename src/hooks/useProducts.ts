import { useQuery } from "@tanstack/react-query";
import { productService, type Product } from "@/services/app/product";

export const useProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productService.getProducts()
  });

  return { products, isLoading };
};

export const useProduct = (id: number) => {
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id
  });

  return { product, isLoading };
};

export const useCategories = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => productService.getCategories()
  });

  return { categories, isLoading };
};

export const useProductsByCategory = (category: string) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", category],
    queryFn: () => productService.getProductsByCategory(category),
    enabled: !!category
  });

  return { products, isLoading };
};

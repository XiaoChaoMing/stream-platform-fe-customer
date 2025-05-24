import { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/mainLayout";
import CategoryPage from "@/pages/category/Category";
import CategoryDetailPage from "@/pages/category/CategoryDetail";

export const categoryRoutes: RouteObject[] = [
  {
    path: "/category",
    element: (
      <MainLayout>
        <CategoryPage />
      </MainLayout>
    ),
  },
  {
    path: "/category/:categoryId",
    element: (
      <MainLayout>
        <CategoryDetailPage />
      </MainLayout>
    ),
  },
]; 
import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { product, isLoading } = useProduct(Number(id));

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(product.rating.rate)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">
              ({product.rating.count} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold">${product.price}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="flex gap-4">
            <Button size="lg">Add to Cart</Button>
            <Button size="lg" variant="outline">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

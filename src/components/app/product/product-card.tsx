import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Product } from "@/services/app/product";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-lg">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="aspect-square w-full overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain"
          />
        </div>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
          {product.description}
        </p>
        <p className="mt-2 text-lg font-bold">${product.price}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

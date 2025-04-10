import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        The page you are looking for does not exist.
      </p>
      <Button onClick={() => navigate("/channel")}>
        Return to Channel List
      </Button>
    </div>
  );
}

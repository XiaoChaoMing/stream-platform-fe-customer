import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Home = lazy(() => import("@/pages/home/Home"));

export const homeRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.HOME,
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        )
      }
    ]
  }
];

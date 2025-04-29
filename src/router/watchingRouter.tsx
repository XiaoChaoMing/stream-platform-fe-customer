import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Watching = lazy(() => import("@/pages/watching/Watching"));

export const watchingRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.WATCHING,
        element: (
          <Suspense fallback={<Loading />}>
                <Watching />
          </Suspense>
        )
      }
    ]
  }
];

import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const VideoDetail = lazy(() => import("@/pages/video/pages/VideoDetail"));

export const videoRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.VIDEO,
        element: (
          <Suspense fallback={<Loading />}>
            <VideoDetail />
          </Suspense>
        )
      }
    ]
  }
]; 
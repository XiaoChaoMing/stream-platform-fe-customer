import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Following = lazy(() => import("@/pages/following/Following"));
const FollowingDetail = lazy(() => import("@/pages/following/components/followingDetail"));
const Overview = lazy(() => import("@/pages/following/pages/Overview"));
const Live = lazy(() => import("@/pages/following/pages/Live"));
const Video = lazy(() => import("@/pages/following/pages/Video"));
const Channel = lazy(() => import("@/pages/following/pages/Channel"));

export const followingRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.FOLLOWING,
        element: (
          <Suspense fallback={<Loading />}>
            <Following />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <FollowingDetail />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Overview />
                  </Suspense>
                )
              },
              {
                path: "live",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Live />
                  </Suspense>
                )
              },
              {
                path: "videos",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Video />
                  </Suspense>
                )
              },
              {
                path: "channels",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Channel />
                  </Suspense>
                )
              }
            ]
          }
        ]
      }
    ]
  }
];

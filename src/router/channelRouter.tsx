import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Channel = lazy(() => import("@/pages/chanel/Channel"));
const Home = lazy(() => import("@/pages/chanel/pages/Home"));
const About = lazy(() => import("@/pages/chanel/pages/About"));
const Schedule = lazy(() => import("@/pages/chanel/pages/Schedule"));
const Video = lazy(() => import("@/pages/chanel/pages/Video"));
const ChannelPage = lazy(
  () => import("@/pages/chanel/components/ChannelDetail")
);

const NotFound = lazy(() => import("@/pages/chanel/pages/NotFound"));

export const channelRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.CHANNEL,
        element: (
          <Suspense fallback={<Loading />}>
            <Channel />
          </Suspense>
        ),
        children: [
          {
            path: ":channelId",
            element: (
              <Suspense fallback={<Loading />}>
                <ChannelPage />
              </Suspense>
            ),
            children: [
              {
                path: "",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                )
              },
              {
                path: "home",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Home />
                  </Suspense>
                )
              },
              {
                path: "about",
                element: (
                  <Suspense fallback={<Loading />}>
                    <About />
                  </Suspense>
                )
              },
              {
                path: "schedule",
                element: (
                  <Suspense fallback={<Loading />}>
                    <Schedule />
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
              }
            ]
          },
          {
            path: "*",
            element: (
              <Suspense fallback={<Loading />}>
                <NotFound />
              </Suspense>
            )
          }
        ]
      }
    ]
  }
];

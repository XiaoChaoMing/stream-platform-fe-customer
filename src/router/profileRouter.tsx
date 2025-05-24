import { lazy, Suspense } from "react";
import { AuthenticateGuard } from "@/guards/AuthneticateGuard";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Profile = lazy(() => import("@/pages/profile/Profile"));
const ProfilePage = lazy(() => import("@/pages/profile/pages/ProfilePage"));
const AccountPage = lazy(() => import("@/pages/profile/pages/AccountPage"));
const PaymentPage = lazy(() => import("@/pages/profile/pages/PaymentPage"));

export const profileRoutes = [
  {
    element: <AuthenticateGuard />,
    children: [
      {
        path: PATH.PROFILE,
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
        children: [
          {
            path: "",
            element: (
              <Suspense fallback={<Loading />}>
                <ProfilePage />
              </Suspense>
            )
          },
          {
            path: "account",
            element: (
              <Suspense fallback={<Loading />}>
                <AccountPage />
              </Suspense>
            )
          },
          {
            path: "payment",
            element: (
              <Suspense fallback={<Loading />}>
                <PaymentPage />
              </Suspense>
            )
          }
        ]
      }
    ]
  }
];

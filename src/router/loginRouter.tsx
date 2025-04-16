import { lazy, Suspense } from "react";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Login = lazy(() => import("@/pages/auth/login"));
const Register = lazy(() => import("@/pages/auth/register"));
const OAuthCallback = lazy(() => import("@/pages/auth/oauth-callback"));

export const loginRoutes = [
  {
    path: PATH.LOGIN,
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    )
  },
  {
    path: PATH.REGISTER,
    element: (
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    )
  },
  {
    path: PATH.OAUTH_CALLBACK,
    element: (
      <Suspense fallback={<Loading />}>
        <OAuthCallback />
      </Suspense>
    )
  }
];

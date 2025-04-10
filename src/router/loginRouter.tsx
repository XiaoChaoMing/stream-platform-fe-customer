import { lazy, Suspense } from "react";
import { PATH } from "@/constants/path";
import Loading from "@/components/base/loading/LoadingBar";

const Login = lazy(() => import("@/pages/auth/login"));

export const loginRoutes = [
  {
    path: PATH.LOGIN,
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    )
  }
];

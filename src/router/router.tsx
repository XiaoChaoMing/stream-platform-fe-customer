import { createBrowserRouter } from "react-router-dom";
import { homeRoutes } from "./homeRouter";
import { channelRoutes } from "./channelRouter";
import { loginRoutes } from "./loginRouter";
import { watchingRoutes } from "./watchingRouter";
import { followingRoutes } from "./followingRouter";
export const router = createBrowserRouter([
  ...homeRoutes,
  ...loginRoutes,
  ...channelRoutes,
  ...watchingRoutes,
  ...followingRoutes
]);

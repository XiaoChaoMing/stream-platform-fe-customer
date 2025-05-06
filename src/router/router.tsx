import { createBrowserRouter } from "react-router-dom";
import { homeRoutes } from "./homeRouter";
import { channelRoutes } from "./channelRouter";
import { loginRoutes } from "./loginRouter";
import { watchingRoutes } from "./watchingRouter";
import { followingRoutes } from "./followingRouter";
import { videoRoutes } from "./videoRouter";

export const router = createBrowserRouter([
  ...homeRoutes,
  ...loginRoutes,
  ...channelRoutes,
  ...watchingRoutes,
  ...followingRoutes,
  ...videoRoutes
]);

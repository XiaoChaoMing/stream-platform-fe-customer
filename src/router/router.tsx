import { createBrowserRouter } from "react-router-dom";
import { homeRoutes } from "./homeRouter";
import { channelRoutes } from "./channelRouter";
import { loginRoutes } from "./loginRouter";

export const router = createBrowserRouter([
  ...homeRoutes,
  ...loginRoutes,
  ...channelRoutes
]);

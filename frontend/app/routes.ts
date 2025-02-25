import { type RouteConfig, index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/main.tsx"),
  ...prefix("sequences", [
          index("routes/SequenceListPage.tsx"),
          route(":id", "routes/SequenceDetailsPage.tsx"),
  ]),
] satisfies RouteConfig;

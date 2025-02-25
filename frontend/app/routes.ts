import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/WelcomePage.tsx"),
    ...prefix("sequences", [
      index("routes/SequenceListPage.tsx"),
      route(":id", "routes/SequenceDetailsPage.tsx"),

    ])
] satisfies RouteConfig;

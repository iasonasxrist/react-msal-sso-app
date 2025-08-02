import Root from "./root";
import ErrorPage from "../Pages/ErrorPages/ErrorPage";
import DashboardPage from "../Pages/DashboardPage/DashboardPage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

export default function MyRouter() {
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
        ],
      },
    ],
    {
      future: {
        // v7_startTransition: true,
        v7_relativeSplatPath: true,
        v7_partialHydration: true,
        v7_normalizeFormMethod: true,
        v7_fetcherPersist: true,
        v7_skipActionErrorRevalidation: true,
      },
    }
  );

  return <RouterProvider router={router} />;
}

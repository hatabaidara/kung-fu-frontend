import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Dashboard } from "./pages/Dashboard";
import { Members } from "./pages/Members";
import { Payments } from "./pages/Payments";
import { Attendance } from "./pages/Attendance";
import { Licenses } from "./pages/Licenses";
import { Announcements } from "./pages/Announcements";
import { Advice } from "./pages/Advice";
import { Gallery } from "./pages/Gallery";
import { Admin } from "./pages/Admin";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { PublicSearch } from "./pages/PublicSearch";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/search",
    Component: PublicSearch,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "members", Component: Members },
      { path: "payments", Component: Payments },
      { path: "attendance", Component: Attendance },
      { path: "licenses", Component: Licenses },
      { path: "announcements", Component: Announcements },
      { path: "advice", Component: Advice },
      { path: "gallery", Component: Gallery },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);
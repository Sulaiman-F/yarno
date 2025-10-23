import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { Navigate } from "react-router";
import Login from "../auth/Login";
import Register from "../auth/Register";
import ProtectedRoute from "../auth/ProtectedRoute";
import UsersPage from "../pages/UsersPage";
import UsersDetails from "../pages/UsersDetails";
import Setting from "../pages/Setting";
import Activity from "../pages/Activity";
import SideBar from "../components/SideBar";
function Layout() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col md:flex-row">
        <div className=" md:w-1/5 w-full h-16 md:h-full">
          <SideBar />
        </div>
        <div className="md:w-4/5 w-full ">
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <UsersDetails /> },
      { path: "users", element: <UsersPage /> },
      { path: "settings", element: <Setting /> },
      { path: "activity", element: <Activity /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
function Router() {
  return <RouterProvider router={router} />;
}

export default Router;

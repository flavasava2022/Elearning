import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "./utils/supabase";
import { getUserProfile, userActions } from "./store/user-slice";
import MainPage from "./pages/landingPage/MainPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import ErrorPage from "./pages/ErrorPage";
import HomeDashboard from "./pages/dashboard/HomeDashboard";
import Loading from "./components/Loading";
import SettingsLayout from "./pages/settings/SettingsLayout";
import MyDetails from "./pages/settings/MyDetails";
import Profile from "./pages/settings/Profile";
import Password from "./pages/settings/Password";
import Plan from "./pages/settings/Plan";
import Billing from "./pages/settings/Billing";
import CreateCourse from "./pages/CreateCourse/CreateCourse";

export default function App() {
  const [session, setSession] = useState(null);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  useEffect(() => {
    let prevAccessToken = null;

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token !== prevAccessToken) {
        prevAccessToken = session?.access_token || null;
        if (_event === "SIGNED_OUT") {
          dispatch(userActions.signOut());
        }
        if (session) {
          dispatch(getUserProfile(session?.user?.id));
        } else {
          dispatch(userActions.setIsLoading());
        }

        setSession(session);
      }
    });
  }, [dispatch]);

  // initSupabaseAuthListener();
  const route = createBrowserRouter([
    { path: "/", element: <MainPage /> },
    {
      path: "/dashboard",
      element: <DashboardLayout />,

      errorElement: <ErrorPage />, // Handle unauthorized access
      children: [
        { path: "/dashboard", element: <HomeDashboard /> },
        // { path: "/dashboard/data", element: <Dashboard /> },
        // { path: "/dashboard/course/:courseId", element: <CoursePage /> },
        {
          path: "/dashboard/mycourses/create/:courseId?",
          element: <CreateCourse />,
        },
        {
          path: "/dashboard/settings",
          element: <SettingsLayout />,
          children: [
            { path: "/dashboard/settings", element: <MyDetails /> },
            { path: "/dashboard/settings/profile", element: <Profile /> },
            { path: "/dashboard/settings/password", element: <Password /> },
            { path: "/dashboard/settings/plan", element: <Plan /> },
            { path: "/dashboard/settings/billing", element: <Billing /> },
            {
              path: "/dashboard/settings/notification",
              element: <Notification />,
            },
          ],
        },
      ],
    },
  ]);
  if (isLoading) {
    return <Loading />;
  }
  return <RouterProvider router={route} />;
}

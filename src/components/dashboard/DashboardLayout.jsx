import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import { NavDashboard } from "./NavDashboard";
import { useSidebar } from "../../context/SidebarContext";
import UserDropdown from "./UserDropdown";
import NotificationDropdown from "./NotificationDropdown";
import { useSelector } from "react-redux";
import Loading from "../Loading";
import { Menu } from "lucide-react";

export default function DashboardLayout() {
  const { isOpen, setIsOpen } = useSidebar();

  const loading = useSelector((state) => state?.user?.isLoading);
  const user = useSelector((state) => state?.user?.userData);
  if (loading) {
    return <Loading />;
  }
  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }
  return (
    <main className=" h-[100vh] flex md:p-4 p-2 bg-white font-[inter] max-h-[100vh]">
      <NavDashboard />
      <div className="w-full md:px-6 px-0 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full ">
          <div className="flex items-center md:gap-6 gap-4 w-[70%]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="  shadow cursor-pointer p-2 h-[40px] "
            >
              <Menu className="min-h-full min-w-full text-primary" />
            </button>

            <input
              type="search"
              id="search-bar"
              className="bg-white  rounded-2xl  md:grow  w-[90%] shadow p-2"
            />
          </div>
          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        </div>
        <div className="overflow-auto">
          {" "}
          <Outlet />
        </div>
      </div>
    </main>
  );
}

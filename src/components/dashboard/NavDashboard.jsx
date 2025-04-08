import { MobileSidebar } from "./MobileSideBar";
import { DesktopSidebar } from "./DesktopSidebar";
import { BookOpen, House, Settings } from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const navItems = [
  { imgUrl: <House />, LinkTo: "/dashboard", text: "Home" },
  { imgUrl: <BookOpen />, LinkTo: "/dashboard/mycourses", text: "My Courses" },
  { imgUrl: <Settings />, LinkTo: "/dashboard/data", text: "Transactions" },
  { imgUrl: <Settings />, LinkTo: "/dashboard/settings", text: "Settings" },
];

export const NavDashboard = () => {
  const { isMobile } = useSidebar();

  return isMobile ? (
    <MobileSidebar navItems={navItems} />
  ) : (
    <DesktopSidebar navItems={navItems} />
  );
};

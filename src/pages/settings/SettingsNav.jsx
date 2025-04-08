import React from "react";
import * as motion from "motion/react-client";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
export default function SettingsNav() {
  const navItems = [
    { LinkTo: "/dashboard/settings", text: "Details" },
    { LinkTo: "/dashboard/settings/profile", text: "Profile" },
    { LinkTo: "/dashboard/settings/password", text: "Password" },
    { LinkTo: "/dashboard/settings/plan", text: "Plan" },
    { LinkTo: "/dashboard/settings/billing", text: "Billing" },
    { LinkTo: "/dashboard/settings/notification", text: "Notification" },
  ];
  const { isMobile } = useSidebar();
  return (
    <ul className={`w-full items-center flex ${isMobile ? "flex-wrap" : null}`}>
      {navItems?.map((item) => (
        <motion.li
          className="relative w-fit rounded-t-md px-6 py-2 bg-transparent z-50"
          key={item.LinkTo}
        >
          <NavLink
            to={item.LinkTo}
            className={`flex items-center gap-4 w-full   `}
            end
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="settings-nav-link"
                    className="rounded-t-xl left-0 absolute w-full h-full bg-primary z-[-2]"
                  />
                )}

                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="truncate font-semibold"
                >
                  {item.text}
                </motion.span>
              </>
            )}
          </NavLink>
        </motion.li>
      ))}
    </ul>
  );
}

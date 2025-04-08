import * as motion from "motion/react-client";
import { NavLink } from "react-router-dom";
export const NavItem = ({ item, isMobile, isOpen }) => (
  <motion.li className="relative w-full rounded-md">
    <NavLink
      to={item.LinkTo}
      className={`flex items-center gap-4 w-full ${
        isOpen ? "p-2" : "p-1"
      } rounded-md  ${
        isMobile || isOpen ? "justify-start" : "justify-center"
      } z-50`}
      end={item.LinkTo === "/dashboard" ? true : false}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <>
              <motion.span
                layoutId="nav-link"
                className="left-0 absolute w-full h-full bg-primary/45  shadow backdrop-blur-none rounded-md"
              />
              {!isMobile && !isOpen && (
                <motion.span
                  layoutId="nav-corner"
                  className="absolute w-1 h-full -left-4 bg-gradient-to-r bg-primary/45  rounded-r-full"
                />
              )}
            </>
          )}
          <div
            className={`${
              isOpen ? "w-[30px]" : "grow-1"
            } flex items-center justify-center`}
          >
            {item.imgUrl}
          </div>

          {(isMobile || isOpen) && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="truncate  font-semibold"
            >
              {item.text}
            </motion.span>
          )}
        </>
      )}
    </NavLink>
  </motion.li>
);

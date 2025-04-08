import { useSidebar } from "../../context/SidebarContext";
import { NavItem } from "./NavItem";
import * as motion from "motion/react-client";
import logo from "../../assets/home-schooling-color-icon.svg";
export const DesktopSidebar = ({ navItems }) => {
  const { isOpen } = useSidebar();
  return (
    <motion.div
      className="h-full border-r border-[#D0D5DD] p-4 flex flex-col gap-8 shadow rounded-2xl bg-white"
      animate={{
        width: isOpen ? "20%" : "5%",
      }}
      transition={{ type: "tween" }}
    >
      <div className="flex items-center gap-4">
        {" "}
        <img src={logo} alt="" className="w-[50px]" />
        <motion.p
          animate={{
            x: isOpen ? 0 : -20,

            fontSize: isOpen ? "1rem" : "0px",
          }}
          transition={0.1}
          className="font-bold"
        >
          E-LEARNING
        </motion.p>
      </div>
      <ul className="h-full flex flex-col gap-6">
        {navItems?.map((item, index) => (
          <NavItem key={index} item={item} isMobile={false} isOpen={isOpen} />
        ))}
      </ul>
    </motion.div>
  );
};

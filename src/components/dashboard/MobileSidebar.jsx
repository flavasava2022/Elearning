import { useSidebar } from "../../context/SidebarContext";
import { NavItem } from "./NavItem";
import * as motion from "motion/react-client";
import logo from "../../assets/home-schooling-color-icon.svg";

import { CircleX } from "lucide-react";
export const MobileSidebar = ({ navItems }) => {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <motion.div
      className="absolute h-[95%] border-r border-[#D0D5DD] p-4 flex flex-col gap-4 shadow rounded-2xl bg-white z-10"
      animate={{
        width: isOpen ? "80%" : "0%",
        x: isOpen ? 0 : -100,
      }}
    >
      <div className="flex items-center gap-4">
        {" "}
        <img src={logo} alt="" className="w-[50px]" />
        <motion.p
          animate={{
            x: isOpen ? 0 : -20,

            fontSize: isOpen ? "22px" : "0px",
          }}
          transition={0.1}
          className="font-bold"
        >
          E-LEARNING
        </motion.p>
      </div>

      <CircleX
        className="absolute top-4 right-4 w-[20px]  cursor-pointer z-50"
        onClick={() => setIsOpen(false)}
      />
      <ul className="h-full flex flex-col gap-6">
        {navItems?.map((item, index) => (
          <NavItem key={index} item={item} isMobile={true} isOpen={true} />
        ))}
      </ul>
    </motion.div>
  );
};

import { useEffect, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { Bell, BookOpen, LogOut, Settings } from "lucide-react";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const MainHolderRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useOutsideClick(dropdownRef, MainHolderRef, () => {
    if (isOpen) setIsOpen(false);
  });
  return (
    <div className="relative">
      <div onClick={toggleDropdown} ref={MainHolderRef}>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          alt="notification icon"
          className="md:w-[40px] md:h-[40px] w-[40px] h-[40px] cursor-pointer flex items-center justify-center"
        >
          <Bell className="text-primary min-w-full min-h-full" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-0 top-[50px] w-[260px] bg-white z-50 shadow-lg rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ul className="flex flex-col gap-3">
              <NotificationMenu image={<Settings />} text="Account Settings" />
              <NotificationMenu image={<BookOpen />} text="My Courses" />
              <NotificationMenu image={<LogOut />} text="Logout" />
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const useOutsideClick = (dropdownRef, MainHolderRef, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !MainHolderRef?.current?.contains(event?.target) &&
        !dropdownRef?.current?.contains(event?.target)
      ) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, MainHolderRef, callback]);
};

function NotificationMenu({ image, text }) {
  return (
    <motion.li
      className="p-2 px-4 w-full cursor-pointer rounded-md flex items-center gap-2"
      whileHover={{ backgroundColor: "#dce7d4" }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="w-[18px]">{image}</div>
      <p className=" font-medium text-[14px] tracking-wide">{text}</p>
    </motion.li>
  );
}

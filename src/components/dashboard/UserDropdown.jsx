import { useEffect, useRef, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"; // Using Framer Motion for animations
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import { BookOpen, LogOut, Settings } from "lucide-react";
export default function UserDropdown() {
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state?.user?.userData);
  const dropdownRef = useRef(null);
  const MainHolderRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useOutsideClick(dropdownRef, MainHolderRef, () => {
    if (isOpen) setIsOpen(false);
  });

  return (
    <div className="relative sha">
      <div onClick={toggleDropdown} ref={MainHolderRef}>
        {user?.avatar_url ? (
          <motion.img
            src={user?.avatar_url}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            alt="Profile"
            className="md:w-[40px] md:h-[40px] w-[35px] h-[35px] rounded-full shadow cursor-pointer"
          />
        ) : (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="md:w-[40px] md:h-[40px] w-[35px] h-[35px] rounded-full shadow text-white bg-primary font-semibold flex items-center justify-center cursor-pointer"
          >
            {user?.first_name?.[0] + user?.last_name?.[0]}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="absolute right-0 top-[50px] w-[260px] bg-white z-50 shadow rounded-xl p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ul className="flex flex-col gap-3">
              <li className="flex gap-3 items-center">
                {user?.avatar_url ? (
                  <motion.img
                    src={user?.avatar_url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    alt="Profile"
                    className="md:w-[40px] md:h-[40px] w-[35px] h-[35px] rounded-full shadow cursor-pointer"
                  />
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="md:w-[40px] md:h-[40px] w-[35px] h-[35px] rounded-full shadow bg-primary text-white font-semibold flex items-center justify-center cursor-pointer"
                  >
                    {user?.first_name?.[0] + user?.last_name?.[0]}
                  </motion.div>
                )}
                <div>
                  <p className=" font-semibold text-[14px] text-primary">
                    {user?.first_name + " " + user?.last_name}
                  </p>
                  <p className=" font-light text-[12px] text-primary">
                    {user?.email}
                  </p>
                </div>
              </li>

              <div className="w-full h-[1px] bg-primary opacity-20 my-2"></div>

              <LinkMenu
                image={
                  <Settings className=" text-primary group-hover:text-white" />
                }
                text="Account Settings"
                url="#"
              />
              <LinkMenu
                image={
                  <BookOpen className=" text-primary group-hover:text-white" />
                }
                text="My Courses"
                url="#"
              />
              <LinkMenu
                image={
                  <LogOut className=" text-primary group-hover:text-white" />
                }
                text="Logout"
                url="#"
                onClick={handleLogout}
              />
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

function LinkMenu({ image, text, url, onClick }) {
  return (
    <motion.li
      className="p-2 px-4 w-full cursor-pointer rounded-md"
      whileHover={{ backgroundColor: "var(--color-primary)" }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={url}
        className="flex items-center gap-3 w-full h-full group"
        onClick={onClick}
      >
        {image}
        <p className=" font-medium text-[14px] tracking-wide text-primary group-hover:text-white">
          {text}
        </p>
      </Link>
    </motion.li>
  );
}

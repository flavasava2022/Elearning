import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      const mobile = window.innerWidth < 1200; // Mobile breakpoint
      setIsMobile(mobile);
      setIsOpen(!mobile); // Auto-close on mobile, open on larger screens
    };

    checkWidth(); // Initial check
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return (
    <SidebarContext.Provider value={{ isMobile, isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);

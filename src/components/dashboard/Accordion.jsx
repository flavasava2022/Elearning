import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import arrowIcon from "../../assets/up-arrow-svgrepo-com.svg";

export const Accordion = ({ children, defaultOpenIndex = null }) => {
  const [activeTab, setActiveTab] = useState(
    typeof defaultOpenIndex === "number" ? defaultOpenIndex : null
  );

  const toggleTab = (index) => {
    setActiveTab((prev) => (prev === index ? null : index));
  };

  const childrenWithProps = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isOpen: activeTab === index,
        toggleTab: () => toggleTab(index),
      });
    }
    return child;
  });

  return (
    <div className="w-auto min-w-[350px] bg-white rounded-xl h-auto text-[#685752] p-2 shadow">
      {childrenWithProps}
    </div>
  );
};

export const TabContainer = ({ children, isOpen, toggleTab }) => {
  const childrenArray = React.Children.toArray(children);

  if (childrenArray.length !== 2) {
    throw new Error("TabContainer expects exactly two children.");
  }

  const [firstChild, secondChild] = childrenArray;

  return (
    <div className="not-first:border-t-1 not-first:border-t-gray-300">
      <div
        className="flex items-center justify-between p-2 w-full cursor-pointer"
        onClick={toggleTab}
      >
        <div
          style={{ color: isOpen ? "#dce7d4" : "#685752" }}
          className="grow flex items-center justify-start"
        >
          {firstChild}
        </div>
        <motion.img
          className="w-[20px]"
          src={arrowIcon}
          alt="arrow icon"
          animate={{
            rotate: isOpen ? 0 : 180,
            filter: isOpen
              ? "brightness(0) saturate(100%) invert(96%) sepia(14%) saturate(237%) hue-rotate(35deg) brightness(93%) contrast(94%)"
              : "brightness(0) saturate(100%) invert(32%) sepia(5%) saturate(1589%) hue-rotate(327deg) brightness(103%) contrast(85%)",
          }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden border-t border-gray-300"
          >
            <div className="p-2">{secondChild}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TabHeader = ({ children }) => <>{children}</>;
export const TabContent = ({ children }) => <>{children}</>;

import { useEffect, useState } from "react";

import * as motion from "motion/react-client";
import { useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

export function CourseBox({ number, text, link }) {
  const [gradientPos, setGradientPos] = useState({ x: "50%", y: "50%" });
  const parentControls = useAnimation();
  const badgeControls = useAnimation();
  const textControls = useAnimation(); // For text
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const pos = { x: `${x}%`, y: `${y}%` };
    setGradientPos(pos);

    // Update Parent
    parentControls.start({
      scale: 1.05,
      backgroundImage: `radial-gradient(circle at ${pos.x} ${pos.y}, var(--color-primary-700) 0% ,var(--color-primary)  50%, var(--color-primary-300) 100%)`,
      backgroundSize: "150% 150%",
      transition: { duration: 0.3 },
    });

    // Update Child
    badgeControls.start({
      backgroundColor: "var(--color-primary)",
      color: "#ffffff",
      y: 0,
      transition: { duration: 0.3 },
    });
    badgeControls.start({
      backgroundColor: "var(--color-warning)",
      color: "#ffffff",
      transition: { duration: 0.3 },
    });
    textControls.start({
      color: "#ffffff",
      transition: { duration: 0.3 },
    });
  };

  const reset = () => {
    parentControls.start({
      scale: 1,
      backgroundImage: "var(--color-white)",
      transition: { duration: 0.3 },
    });
    badgeControls.start({
      backgroundColor: "var(--color-primary)",
      color: "var(--color-white)",

      transition: { duration: 0.3 },
    });
    textControls.start({
      color: "var(--color-black)",

      transition: { duration: 0.3 },
    });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      animate={parentControls}
      style={{ backgroundSize: "100% 100%" }}
      className="grow h-[160px] shadow bg-white rounded-xl min-w-[240px] p-2 py-4 flex flex-col  justify-between"
    >
      <div className="flex items-center gap-4 p-2">
        <motion.div
          animate={badgeControls}
          className="w-[50px] h-[50px] rounded-full bg-primary shadow flex items-center justify-center text-[16px] font-semibold"
        >
          {number ? number : 0}
        </motion.div>
        <motion.p animate={textControls} className="text-[18px] font-semibold">
          {text ? text : "Total Courses"}
        </motion.p>
      </div>
      <Link>
        <motion.p
          animate={textControls}
          className="text-[18px] font-semibold  place-self-end mr-4"
        >
          View Details
        </motion.p>
      </Link>
    </motion.div>
  );
}

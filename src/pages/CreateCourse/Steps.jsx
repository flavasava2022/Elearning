import React from "react";
import trueIcon from "../../assets/correct-signal-svgrepo-com.svg";
import dotIcon from "../../assets/dot-svgrepo-com.svg";
import inprogressIcon from "../../assets/dot-circle-svgrepo-com.svg";
import * as motion from "motion/react-client";
import { CircleCheck, CircleDot, Dot } from "lucide-react";

export default function Steps({ status }) {
  return (
    <ul className="w-full flex flex-wrap md:flex-nowrap justify-center items-center gap-4 md:gap-6 py-4 px-2">
      <Step text={"Course Details"} status={status} index={1} />

      <Step text={"Upload Videos"} status={status} index={2} />
    </ul>
  );
}

function Step({ text, status, index }) {
  const isActive = Number(status) === index;
  const isComplete = Number(status) > index;
  return (
    <motion.li
      key={index}
      animate={{
        backgroundColor: isActive ? "var(--color-primary)" : "#f2f4f6",

        scale: isActive ? 1.05 : 1,
      }}
      className="step-list__item shadow w-full h-full flex items-center p-4 px-8 justify-start gap-4"
    >
      {isActive ? (
        <CircleDot className="w-5 h-5 text-white" />
      ) : isComplete ? (
        <CircleCheck className="w-5 h-5 text-primary" />
      ) : (
        <Dot className="w-6 h-6 text-black" />
      )}

      <motion.p
        animate={{
          color:
            Number(status) === Number(index)
              ? "#ffffff"
              : Number(status) > Number(index)
              ? "var(--color-primary)"
              : "#000000",
        }}
        className="font-bold text-[18px]"
      >
        {text}
      </motion.p>
    </motion.li>
  );
}

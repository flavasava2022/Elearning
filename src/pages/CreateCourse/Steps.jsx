import React from "react";
import trueIcon from "../../assets/correct-signal-svgrepo-com.svg";
import dotIcon from "../../assets/dot-svgrepo-com.svg";
import inprogressIcon from "../../assets/dot-circle-svgrepo-com.svg";
import * as motion from "motion/react-client";
import { CircleCheck, CircleDot, Dot } from "lucide-react";

export default function Steps({ status }) {
  return (
    <ul className=" w-full flex items-center justify-center h-[90px] gap-6 py-4">
      <Step text={"Course Details"} status={status} index={1} />

      <Step text={"Upload Videos"} status={status} index={2} />

      <Step text={"About Course"} status={status} index={3} />

      <Step text={"Publish Course"} status={status} index={4} />
    </ul>
  );
}

function Step({ text, status, index }) {
  return (
    <motion.li
      key={index}
      animate={{
        backgroundColor:
          Number(status) === Number(index) ? "var(--color-primary)" : "#ffffff",
      }}
      className="step-list__item shadow w-full h-full flex items-center p-4 px-8 justify-start gap-4"
    >
      {Number(status) === Number(index) ? (
        <CircleDot className="w-[20px] text-white" />
      ) : Number(status) > Number(index) ? (
        <CircleCheck className="w-[20px] text-primary" />
      ) : (
        <Dot className="w-[40px] h-[40px] text-black" />
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

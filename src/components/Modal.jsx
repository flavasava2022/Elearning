import { createPortal } from "react-dom";
import { motion } from "framer-motion";

export default function Modal({ title, children, onClose }) {
  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="backdrop"
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={onClose}
      />
      <motion.dialog
        open
        className="modal translate-x-[-50%] translate-y-[-50%] shadow p-4 rounded-2xl flex flex-col gap-4 items-center"
        key="modal"
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        exit={{ opacity: 0, rotateY: -90 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: "preserve-3d", perspective: 20000 }}
      >
        <h2 className="font-bold">{title}</h2>
        {children}
      </motion.dialog>
    </>,
    document.getElementById("modal")
  );
}

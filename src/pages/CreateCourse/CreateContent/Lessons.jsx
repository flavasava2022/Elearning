import { useSortable } from "@dnd-kit/sortable";
import React, { useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Menu, Pencil, Play, Trash2, TvMinimalPlay } from "lucide-react";
import EditLessonModal from "./modals/EditLessonModal";
export default function Lessons({
  id,
  index,
  lessonData,
  isUpdating,
  onDelete,
  setLessonsData,
  setConfirmedLessonsData,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",

    opacity: isUpdating ? 0.8 : 1,
  };
  return (
    <div
      className="bg-white  flex w-full p-4 items-center justify-between  gap-6  border-1  border-gray-200 "
      ref={setNodeRef}
      style={style}
    >
      <motion.button
        {...attributes}
        {...listeners}
        style={{
          cursor: isUpdating ? "wait" : "grab",
        }}
        animate={{ cursor: isUpdating ? "wait" : "grab" }}
        className=" rounded-md"
        disabled={isUpdating}
      >
        <Menu className="w-[25px] h-[25px] text-primary" />
      </motion.button>

      <p className="font-semibold text-primary">Lesson {index + 1}</p>
      <div className="flex items-center justify-center gap-4 grow max-w-[30%]">
        <TvMinimalPlay className="text-primary" />
        <p className="font-semibold grow text-black">{lessonData?.title}</p>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={() => setModalIsOpen(true)}
          style={{
            cursor: "pointer",
          }}
          disabled={isUpdating}
        >
          {" "}
          <Pencil className="w-5 h-5 text-primary" />
        </button>

        <button
          onClick={() => onDelete(id)}
          style={{
            cursor: "pointer",
          }}
          disabled={isUpdating}
        >
          {" "}
          <Trash2 className="text-danger" />
        </button>
        {modalIsOpen && (
          <EditLessonModal
            id={id}
            onClose={() => setModalIsOpen(false)}
            setLessonsData={setLessonsData}
            setConfirmedLessonsData={setConfirmedLessonsData}
            item={lessonData}
          />
        )}
      </div>
    </div>
  );
}

import React from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { Menu, Pencil, Trash2 } from "lucide-react";
export default function Module({
  id,
  index,
  item,
  isUpdating,
  hasError,
  onDelete,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    display: "flex",
    marginBottom: "2rem",
    opacity: isUpdating ? 0.8 : 1,
  };

  return (
    <div
      className="bg-gray-100 shadow flex w-full p-4 items-center  gap-6  border-1 rounded-xl border-none flex-col"
      ref={setNodeRef}
      style={style}
    >
      <div className="w-full flex items-center justify-between gap-4 px-1">
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

        <p className="font-semibold text-primary">Module {index + 1}</p>
        <p className="font-semibold grow text-primary">{item?.title}</p>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => onDelete(id)}
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
        </div>
      </div>
      <div className="w-[99%] bg-white rounded-xl min-h-[110px]"></div>
    </div>
  );
}

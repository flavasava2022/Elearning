import React, { useEffect, useState } from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { CirclePlus, Menu, Pencil, Trash2 } from "lucide-react";
import { supabase } from "../../../utils/supabase";
import toast from "react-hot-toast";
import Lessons from "./Lessons";

import EditModuleModal from "./modals/EditModuleModal";
import CreateLessonModal from "./modals/createLessonModal";
export default function Module({
  id,
  index,
  item,
  isUpdating,
  onDelete,
  setConfirmedModulesData,
  setModulesData,
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
  // Load initial data
  useEffect(() => {
    if (item?.lessons) {
      const sortedLessons =
        item?.lessons?.sort((a, b) => a.order - b.order) || [];
      setLessonsData(sortedLessons);
      setConfirmedLessonsData(sortedLessons);
      setLoading(false);
    }
  }, [item]);
  const [lessonsData, setLessonsData] = useState([]); // Lessons Data
  const [confirmedLessonsData, setConfirmedLessonsData] = useState([]); // Lessons Data in DB

  const [updatingLessonsIds, setUpdatingLessonsIds] = useState([]);

  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  async function updateModulePosition(id, position) {
    try {
      const { error } = await supabase
        .from("lessons")
        .update({ order: position })
        .eq("id", id);

      if (error) {
        return { error };
      }

      return { success: true };
    } catch (error) {
      return { error };
    }
  }

  const handleDeleteItem = async (id) => {
    try {
      setUpdatingLessonsIds((prev) => [...prev, id]);

      const { data, error: updateError } = await supabase
        .from("lessons")
        .delete()
        .eq("id", id);
      if (!updateError) {
        setLessonsData((prev) => prev.filter((item) => item.id !== id));
        setConfirmedLessonsData((prev) =>
          prev.filter((item) => item.id !== id)
        );
        toast.success("Lesson Successfully Deleted!");
      } else {
        toast.error("Something Wrong Happened!");
      }
    } finally {
      setUpdatingLessonsIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // Update positions in DB
  const updatePositionsInDB = async (newItems) => {
    let hasError = false;
    try {
      const updatePromises = newItems.map(async (module, index) => {
        setUpdatingLessonsIds((prev) => [...prev, module.id]);
        const result = await updateModulePosition(module.id, index + 1);
        if (result.error) {
          hasError = true;
        }
        return result;
      });
      await Promise.all(updatePromises);
      if (!hasError) {
        // All updates succeeded
        setConfirmedLessonsData(newItems);
        toast.success("Lessons Successfully Updated!");
      } else {
        // Revert to last confirmed state
        setLessonsData(confirmedLessonsData);
        toast.error("Something Wrong Happened!");
      }
    } finally {
      setUpdatingLessonsIds([]);
    }
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = lessonsData.findIndex((item) => item.id === active.id);
      const newIndex = lessonsData.findIndex((item) => item.id === over.id);

      // Optimistically update UI
      const newItems = arrayMove(lessonsData, oldIndex, newIndex);
      setLessonsData(newItems);

      // Update positions in DB
      try {
        await updatePositionsInDB(newItems);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <p>loading</p>;

  return (
    <div
      className="bg-gray-100 shadow flex w-full p-4 items-center  gap-4  border-1 rounded-xl border-none flex-col"
      ref={setNodeRef}
      style={style}
    >
      <div className=" flex items-center justify-between gap-4 px-1 w-[99%]">
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
          <motion.button
            onClick={() => setCreateModalIsOpen(true)}
            style={{
              cursor: "pointer",
            }}
            whileHover={{
              scale: 1.1,
            }}
          >
            <CirclePlus className="w-5 h-5 text-primary" />
          </motion.button>
          <motion.button
            onClick={() => setEditModalIsOpen(true)}
            style={{
              cursor: "pointer",
            }}
            whileHover={{
              scale: 1.1,
            }}
            disabled={isUpdating}
          >
            {" "}
            <Pencil className="w-5 h-5 text-primary" />
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.1,
            }}
            onClick={() => onDelete(id)}
            style={{
              cursor: "pointer",
            }}
            disabled={isUpdating}
          >
            {" "}
            <Trash2 className="text-danger" />
          </motion.button>
        </div>
      </div>
      <div className="w-[99%] bg-white rounded-md h-fit max-h-[25vh] overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={lessonsData}
            strategy={verticalListSortingStrategy}
          >
            {lessonsData.map((item, index) => (
              <Lessons
                key={item?.id}
                id={item?.id}
                index={index}
                lessonData={item}
                isUpdating={updatingLessonsIds.includes(item.id)}
                onDelete={handleDeleteItem}
                setLessonsData={setLessonsData}
                setConfirmedLessonsData={setConfirmedLessonsData}
              />
            ))}
          </SortableContext>
        </DndContext>

        {lessonsData.length === 0 && (
          <div className="flex items-center p-2 justify-center text-danger min-h-[60px]">
            No Lessons in this Module.
          </div>
        )}
      </div>
      {createModalIsOpen && (
        <CreateLessonModal
          id={id}
          onClose={() => setCreateModalIsOpen(false)}
          position={lessonsData.length + 1}
          setConfirmedLessonsData={setConfirmedLessonsData}
          setLessonsData={setLessonsData}
        />
      )}
      {editModalIsOpen && (
        <EditModuleModal
          id={id}
          onClose={() => setEditModalIsOpen(false)}
          setConfirmedModulesData={setConfirmedModulesData}
          setModulesData={setModulesData}
          item={item}
        />
      )}
    </div>
  );
}

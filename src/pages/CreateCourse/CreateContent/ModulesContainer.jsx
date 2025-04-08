import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { AnimatePresence } from "motion/react";
import CreateModuleModal from "../CreateModuleModal";
import { supabase } from "../../../utils/supabase";
import Module from "./Module";
import toast from "react-hot-toast";

export default function ModulesContainer({ courseData }) {
  const [modulesData, setModulesData] = useState([]); // Modules Data
  const [confirmedModulesData, setConfirmedModulesData] = useState([]); // Modules Data in DB

  const [updatingModuleIds, setUpdatingModuleIds] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
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
        .from("modules")
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
      setUpdatingModuleIds((prev) => [...prev, id]);

      const { data, error: updateError } = await supabase
        .from("modules")
        .delete()
        .eq("id", id);
      if (!updateError) {
        setModulesData((prev) => prev.filter((item) => item.id !== id));
        setConfirmedModulesData((prev) =>
          prev.filter((item) => item.id !== id)
        );
        toast.success("Modules Successfully Deleted!");
      } else {
        toast.error("Something Wrong Happened!");
      }
    } finally {
      setUpdatingModuleIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };
  // Load initial data
  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const { data: dbModulesData, error: modulesError } = await supabase
          .from("modules")
          .select("*, lessons(*)")
          .eq("course_id", courseData?.id)
          .order("order", { ascending: true });

        if (modulesError) throw modulesError;
        setModulesData(dbModulesData || []);
        setConfirmedModulesData(dbModulesData || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (courseData?.id) {
      fetchModules();
    }
  }, [courseData?.id]);

  // Update positions in DB
  const updatePositionsInDB = async (newItems) => {
    let hasError = false;
    try {
      const updatePromises = newItems.map(async (module, index) => {
        setUpdatingModuleIds((prev) => [...prev, module.id]);
        const result = await updateModulePosition(module.id, index + 1);
        if (result.error) {
          hasError = true;
        }
        return result;
      });
      console.log(updatePromises);
      await Promise.all(updatePromises);
      if (!hasError) {
        // All updates succeeded
        setConfirmedModulesData(newItems);
        toast.success("Modules Successfully Updated!");
      } else {
        // Revert to last confirmed state
        setModulesData(confirmedModulesData);
        toast.error("Something Wrong Happened!");
      }
    } finally {
      setUpdatingModuleIds([]);
    }
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = modulesData.findIndex((item) => item.id === active.id);
      const newIndex = modulesData.findIndex((item) => item.id === over.id);

      // Optimistically update UI
      const newItems = arrayMove(modulesData, oldIndex, newIndex);
      setModulesData(newItems);

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
    <div className="bg-white rounded-xl p-2">
      {" "}
      {/* Header */}
      <div className="w-full flex items-center justify-between gap-4 mb-2">
        {/* Add new item form */}
        <p className="font-bold text-[26px] border-l-8 px-2 border-l-primary">
          Modules
        </p>
        <motion.button
          onClick={() => setModalIsOpen(true)}
          className="w-fit border-primary border-2 font-bold text-primary rounded-md p-2 px-4  cursor-pointer"
        >
          Add Module
        </motion.button>
      </div>
      {/* Sortable list */}
      <div className="mt-8  overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={modulesData}
            strategy={verticalListSortingStrategy}
          >
            {modulesData.map((item, index) => (
              <Module
                key={item?.id}
                id={item?.id}
                index={index}
                item={item}
                isUpdating={updatingModuleIds.includes(item.id)}
                onDelete={handleDeleteItem}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {modulesData.length === 0 && (
        <div className="flex items-center p-2 justify-center text-danger">
          No Modules in the Course.
        </div>
      )}
      <AnimatePresence>
        {modalIsOpen && (
          <CreateModuleModal
            id={courseData?.id}
            onClose={() => setModalIsOpen(false)}
            position={modulesData.length + 1}
            setConfirmedItems={setConfirmedModulesData}
            setItems={setModulesData}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

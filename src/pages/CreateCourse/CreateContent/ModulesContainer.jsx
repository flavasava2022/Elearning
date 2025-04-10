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

import { supabase } from "../../../utils/supabase";
import Module from "./Module";
import toast from "react-hot-toast";
import CreateModuleModal from "./modals/CreateModuleModal";
import { ClipLoader } from "react-spinners";
import { useFormStatus } from "react-dom";
import { useNavigate } from "react-router-dom";

export default function ModulesContainer({ courseData, setIndex }) {
  const [modulesData, setModulesData] = useState([]); // Modules Data
  const [confirmedModulesData, setConfirmedModulesData] = useState([]); // Modules Data in DB
  const [updatingModuleIds, setUpdatingModuleIds] = useState([]);
  const navigate = useNavigate();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  async function publishCourse() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .update({ published: true })
        .eq("id", courseData?.id);

      if (error) throw error;

      if (!error) {
        toast.success("Congrats You Published New Course");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  }
  // Load initial data
  useEffect(() => {
    setLoading(true);
    const fetchModules = async () => {
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

  return (
    <>
      {loading ? (
        <ClipLoader color="#2d9cdb" />
      ) : (
        <div className="bg-white rounded-xl p-2 h-full w-full flex items-center  flex-col">
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
              whileHover={{
                background: "var(--color-primary)",
                color: "var(--color-white)",
                scale: 1.1,
              }}
            >
              Add Module +
            </motion.button>
          </div>
          {/* Sortable list */}
          {modulesData.length === 0 ? (
            <div className="flex items-center p-2 justify-center text-primary w-full">
              No Modules in the Course.
            </div>
          ) : (
            <div className="mt-4 max-h-full w-full overflow-auto">
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
                      setConfirmedModulesData={setConfirmedModulesData}
                      setModulesData={setModulesData}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
          <AnimatePresence>
            {modalIsOpen && (
              <CreateModuleModal
                id={courseData?.id}
                onClose={() => setModalIsOpen(false)}
                position={modulesData.length + 1}
                setConfirmedModulesData={setConfirmedModulesData}
                setModulesData={setModulesData}
              />
            )}
          </AnimatePresence>
          <form className=" mr-0 ml-auto mt-auto" action={publishCourse}>
            <SubmitButton setIndex={setIndex} />
          </form>
        </div>
      )}
    </>
  );
}

const SubmitButton = ({ setIndex }) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-2  bg-white p-2">
      <button
        disabled={pending}
        type="button"
        onClick={() => setIndex((prev) => prev - 1)}
        className="cursor-pointer bg-primary p-2 px-6 flex items-center justify-center rounded-md text-white font-bold"
      >
        Back
      </button>
      <button
        disabled={pending}
        className="bg-primary cursor-pointer p-2 px-6 flex items-center justify-center rounded-md text-white font-bold"
      >
        {pending ? "Loading..." : "Publish Course"}
      </button>
    </div>
  );
};

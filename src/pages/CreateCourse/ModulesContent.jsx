import React, { useState } from "react";
import {
  Accordion,
  TabContainer,
  TabContent,
  TabHeader,
} from "../../components/dashboard/Accordion";
import { motion, AnimatePresence } from "framer-motion";
import CreateModuleModal from "./CreateModuleModal";
import CreateLessonModal from "./createLessonModule";
export default function ModulesContent({ modulesData }) {
  const [newLessonModal, setNewModalLesson] = useState(false);
  return (
    <>
      <Accordion defaultOpenIndex={0}>
        {modulesData?.map((module) => (
          <TabContainer key={module.id}>
            <TabHeader>
              <div className="w-full flex  justify-between gap-2 p-2">
                <p className=" capitalize font-semibold">{module?.title}</p>
                <p className=" ml-1 text-[16px] font-light">
                  {module?.lessons?.length}{" "}
                  {module?.lessons?.length > 1 ? "lessons" : "lesson"}
                </p>
              </div>
            </TabHeader>
            <TabContent>
              <ul className="w-full p-4 flex flex-col gap-4">
                <AnimatePresence>
                  {newLessonModal && (
                    <CreateLessonModal
                      id={module?.id}
                      onClose={() => setNewModalLesson(false)}
                    />
                  )}
                </AnimatePresence>
                {module?.lessons.map((lesson) => (
                  <li key={lesson?.id} className="flex items-center gap-4 ">
                    <div className="flex flex-col ">
                      <motion.p className=" capitalize text-[14px] font-semibold">
                        {lesson?.title}
                      </motion.p>
                      <motion.p className="text-sm font-light capitalize">
                        {lesson?.content_type === null
                          ? "video"
                          : lesson?.content_type}{" "}
                        {" / "}
                        {lesson?.duration_minutes === null
                          ? 0
                          : lesson?.duration_minutes}{" "}
                        mins
                      </motion.p>
                    </div>
                  </li>
                ))}
                <li key={0} className="flex items-center gap-4 ">
                  {" "}
                  <button
                    className="w-fit bg-linear-to-r from-[#0179FE] to-[#4893FF] rounded-md p-2 px-4 text-white cursor-pointer font-[inter] mx-auto"
                    onClick={() => setNewModalLesson(true)}
                  >
                    Add New Lesson
                  </button>
                </li>
              </ul>
            </TabContent>
          </TabContainer>
        ))}
      </Accordion>
    </>
  );
}

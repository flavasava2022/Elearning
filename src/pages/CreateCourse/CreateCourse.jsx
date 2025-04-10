import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Steps from "./Steps";

import { supabase } from "../../utils/supabase";
import CourseDetails from "./CourseDetails";
import ModulesContainer from "./CreateContent/ModulesContainer";
import { ClipLoader } from "react-spinners";
let firstTime = true;
export default function CreateCourse() {
  const { courseId } = useParams();
  const [index, setIndex] = useState(1);
  const [courseData, setCourseData] = useState(null);

  const DATA = [
    courseData ? (
      <CourseDetails courseData={courseData} setIndex={setIndex} />
    ) : (
      <ClipLoader color="#2d9cdb" />
    ),
    <ModulesContainer courseData={courseData} setIndex={setIndex} />,
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId);

        if (error) throw error;
        setCourseData(data[0] || []);
        if (firstTime) {
          setIndex(data[0]?.published === "true" ? 1 : data[0]?.published);
          firstTime = false;
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (courseId) {
      fetchCourses();
    }
  }, [courseId, index]);

  return (
    <div className="p-2 flex flex-col items-center gap-2 h-[90vh] ">
      <Steps status={index} />

      <div className="p-2 w-full rounded-lg shadow bg-white h-full overflow-auto flex items-center justify-center">
        {DATA[index - 1]}
      </div>
    </div>
  );
}

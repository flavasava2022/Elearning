import React, { useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import Steps from "./Steps";

import { supabase } from "../../utils/supabase";
import CourseDetails from "./CourseDetails";
import ModulesContainer from "./CreateContent/ModulesContainer";

export default function CreateCourse() {
  const { courseId } = useParams();
  const [index, setIndex] = useState(1);
  const [courseData, setCourseData] = useState(null);
  const [Loading, setLoading] = useState(false);
  const DATA = [
    <CourseDetails courseData={courseData} setIndex={setIndex} />,
    <ModulesContainer courseData={courseData} setIndex={setIndex} />,
  ];
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("id", courseId);

        if (error) throw error;
        setCourseData(data[0] || []);
        setIndex(data[0]?.published);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    if (courseId) {
      fetchCourses();
    }
  }, [courseId]);
  console.log(courseData);
  return (
    <div className="p-2 flex flex-col items-center gap-8">
      <Steps status={index} />

      <div className="p-2 w-full rounded-lg shadow bg-white h-full">
        {Loading ? <p>Loading</p> : DATA[index - 1]}
      </div>
    </div>
  );
}

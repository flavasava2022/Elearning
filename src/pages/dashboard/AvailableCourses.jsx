import React, { useEffect, useState } from "react";
import * as motion from "motion/react-client";
import { supabase } from "../../utils/supabase";
import { Link } from "react-router-dom";
import courseImg from "../../assets/courseImg.jpg";
export default function AvailableCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from("courses")
          .select("*")
          .eq("published", true)
          .order("created_at", {
            ascending: false,
          });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="flex items-center gap-8 justify-between p-2 md:flex-wrap w-full overflow-auto">
      {courses?.map((course) => (
        <CourseContainer course={course} key={course?.id} />
      ))}
    </div>
  );
}

function CourseContainer({ course }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.5 } }}
      className="h-[450px] text shadow capitalize bg-white rounded-xl min-w-[230px] w-[23%] p-2 gap-2  flex flex-col  justify-start items-center"
    >
      <img
        src={course?.img ? course?.img : courseImg}
        alt={course?.title}
        className=" w-fit rounded-md"
      />
      <div className="w-[98%] flex flex-col gap-1 p-2 h-full justify-between">
        <span className="bg-primary text-white w-fit px-2 rounded-md ">
          {course?.category_name ? course?.category_name : "development"}
        </span>
        <p className="text-[16px] text-gray-300">
          {course?.title ? course?.title : "title"}
        </p>
        <p className="text-[12px] font-bold  overflow-y-auto max-h-[3rem]">
          {course?.description ? course?.description : "description"}
        </p>
        <p>
          created by{" "}
          <span className="text-gray-300 text-[14px]">
            {course?.instructor_name
              ? course?.instructor_name
              : "instructor name"}
          </span>
        </p>
        <Link to={`/dashboard/course/${course?.id}`} className="w-full">
          <motion.button
            className="w-full flex items-center justify-center p-2 bg-primary text-white rounded-md cursor-pointer"
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.5 },
            }}
          >
            {" "}
            View Details
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

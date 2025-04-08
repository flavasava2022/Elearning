import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { supabase } from "../../utils/supabase";
import { CourseBox } from "./courseBox";
export default function CoursesOverview() {
  const user = useSelector((state) => state?.user?.userData);
  const role = user?.role;
  const [courses, setCourses] = useState([]);

  const allCourses = courses?.length;
  const completedCourses =
    courses?.length > 1 &&
    courses?.reduce((acc, cur) => {
      if (
        role === "student"
          ? cur?.completion_status === "completed"
          : cur?.published === true
      ) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from(`${role === "student" ? "enrollments" : "courses"}`)
          .select("*")
          .eq(`${role === "student" ? "user_id" : "instructor_id"}`, user?.id)
          .order(`${role === "student" ? "enrolled_at" : "created_at"}`, {
            ascending: false,
          });

        if (error) throw error;
        setCourses(data || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user, role]);
  return (
    <div className="flex items-center gap-8 justify-between p-2 md:flex-wrap w-full overflow-auto">
      <CourseBox number={allCourses} />

      <CourseBox number={completedCourses} text="Completed Courses" />
      <CourseBox
        number={allCourses - completedCourses}
        text="In-Progress Courses"
      />
      <CourseBox />
    </div>
  );
}

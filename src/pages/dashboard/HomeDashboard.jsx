import React from "react";
import CoursesOverview from "./CoursesOverview";
import AvailableCourses from "./AvailableCourses";

export default function HomeDashboard() {
  return (
    <div className="flex flex-col gap-6 p-2">
      <div>
        <h1 className="text-3xl font-semibold mb-8">Courses Overview</h1>
        <CoursesOverview />
      </div>
      <div>
        <h1 className="text-3xl font-semibold mb-8">Available Courses</h1>
        <AvailableCourses />
      </div>
    </div>
  );
}

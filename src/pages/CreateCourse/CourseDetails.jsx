import React from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useAnimate } from "motion/react";
import { useActionState, useEffect, useState } from "react";

import { useFormStatus } from "react-dom";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";

import { supabase, uploadFile } from "../../utils/supabase";
import { InputField } from "../../components/InputField";

import ImageUpload from "./imageUpload";
import { CircleX } from "lucide-react";

export default function CourseDetails({ courseData, setIndex }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const formDataFields = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);

    if (!courseData?.image_url && formDataFields?.pic?.size === 0) {
      errors.pic = "This field is required.";
    }
    if (formDataFields?.courseName?.trim().length === 0) {
      errors.courseName = "This field is required.";
    }
    if (formDataFields?.courseDescription?.trim().length === 0) {
      errors.courseDescription = "This field is required.";
    }

    animate(`input`, { borderColor: "#D0D5DD" });
    if (Object.keys(errors)?.length > 0) {
      console.log(errors);
      Object.keys(errors).forEach((key) => {
        animate(
          `#${key}`,
          { x: [-10, 5], borderColor: "#c10007" },
          { type: "spring", duration: 0.7 }
        );
      });

      return { errors: errors, defaultValues: formDataFields };
    } else {
      const fileName = `${user.email}_${formDataFields?.courseName}_course-pic`;

      try {
        if (courseData) {
          console.log("course details exist");
          if (formDataFields?.pic?.size === 0) {
            const { data, error: updateError } = await supabase
              .from("courses")
              .update({
                title: formDataFields?.courseName,
                description: formDataFields?.courseDescription,
                instructor_name: `${user?.first_name} ${user?.last_name}`,
                instructor_id: user?.id,
              })
              .eq("id", courseData?.id)
              .select()
              .single();

            if (data) {
              setIndex(2);
            }
          } else {
            const url = await uploadFile(formDataFields.pic, fileName);
            if (url) {
              const { data, error: updateError } = await supabase
                .from("courses")
                .update({
                  title: formDataFields?.courseName,
                  description: formDataFields?.courseDescription,
                  image_url: url,
                  instructor_name: `${user?.first_name} ${user?.last_name}`,
                  instructor_id: user?.id,
                })
                .eq("id", courseData?.id)
                .select()
                .single();

              if (data) {
                setIndex(2);
              }
            }
          }
        } else {
          console.log("course details not exist");
          const url = await uploadFile(formDataFields.pic, fileName);
          if (url) {
            const { data, error: updateError } = await supabase
              .from("courses")
              .insert({
                title: formDataFields?.courseName,
                description: formDataFields?.courseDescription,
                image_url: url,
                instructor_name: `${user?.first_name} ${user?.last_name}`,
                instructor_id: user?.id,
                published: 2,
              })
              .select()
              .single();

            if (data) {
              setIndex(2);

              navigate(`/dashboard/mycourses/create/${data?.id}`);
            }
          }
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
      return {
        errors: null,
        defaultValues: formDataFields,
      };
    }
  }

  const [formState, formActions] = useActionState(signupActions, {
    errors: null,
    defaultValues: {
      courseName: courseData?.title,
      courseDescription: courseData?.description,
    },
  });

  return (
    <div className="p-2 flex flex-col gap-4 h-full w-full">
      <h1 className="font-bold text-[28px]">Course Details</h1>
      <motion.form
        className="flex flex-col gap-6 h-full"
        action={formActions}
        ref={scope}
      >
        <div className="flex  p-2 gap-8 ">
          <div className="flex flex-col gap-2 md:w-[20%] h-full">
            <p className="font-bold">
              Thumbnail Image <span>(Required)</span>
            </p>
            <ImageUpload courseData={courseData} formState={formState} />
          </div>
          <div className="w-full">
            <InputField
              label="Course Name"
              name="courseName"
              formState={formState}
              type="text"
              placeHolder="Enter Course Name"
              width={"full"}
            />
            <InputField
              label="Course Description"
              name="courseDescription"
              formState={formState}
              type="textarea"
              placeHolder="Enter Course Description"
              width={"full"}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
            <CircleX className="w-[18px] text-danger" /> {errorMsg}
          </div>
        )}
        <SubmitButton />
      </motion.form>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-fit bg-primary rounded-md p-2 px-8 text-white cursor-pointer font-[inter] mr-0 ml-auto mt-auto"
    >
      {pending ? "Loading..." : "Next"}
    </button>
  );
};

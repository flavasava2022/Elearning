import React from "react";

import { AnimatePresence, motion } from "framer-motion";

import { useAnimate } from "motion/react";
import { useActionState, useEffect, useState } from "react";

import { useFormStatus } from "react-dom";

import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { inputValidate } from "../../utils/forms";
import { supabase, uploadFile } from "../../utils/supabase";
import { InputField } from "../../components/InputField";
import { div } from "motion/react-client";
import UploadButton from "../../components/UploadButton";
import ImageUpload from "./imageUpload";
import { CircleX } from "lucide-react";
export default function CourseDetails({ courseData, setIndex }) {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const courseData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);

    if (courseData?.pic?.size === 0) {
      errors.pic = "This field is required.";
    }
    if (courseData?.courseName?.trim().length === 0) {
      errors.courseName = "This field is required.";
    }
    if (courseData?.courseDescription?.trim().length === 0) {
      errors.courseDescription = "This field is required.";
    }
    console.log(errors);
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

      return { errors: errors, defaultValues: courseData };
    } else {
      const fileName = `${user.email}_${courseData?.courseName}_course-pic`;
      try {
        const url = await uploadFile(courseData.pic, fileName);
        if (url) {
          const { error: updateError } = await supabase.from("courses").insert({
            title: courseData?.courseName,
            description: courseData?.courseDescription,
            image_url: url,
            instructor_name: `${user?.first_name} ${user?.last_name}`,
            instructor_id: user?.id,
            published: 2,
          });

          if (!updateError) {
            console.log("done");
            setIndex(2);
          }
        }
      } catch (err) {
        console.error("Error uploading file:", err);
      }
      return {
        errors: null,
        defaultValues: pervData,
      };
    }
  }

  const [formState, formActions] = useActionState(signupActions, {
    errors: null,
    defaultValues: {
      courseName: courseData?.title,
      courseDescription: courseData?.description,
      pic: courseData?.image_url,
    },
  });
  return (
    <div className="p-2 flex flex-col gap-4">
      <h1 className="font-bold text-[28px]">Course Details</h1>
      <motion.form
        className="flex flex-col gap-6"
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
      className="w-full bg-linear-to-r from-[#0179FE] to-[#4893FF] rounded-md p-2 text-white cursor-pointer font-[inter]"
    >
      {pending ? "Loading..." : "Next"}
    </button>
  );
};

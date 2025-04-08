import { useAnimate } from "motion/react";
import React, { useActionState, useState } from "react";
import { supabase } from "../../utils/supabase";
import { useFormStatus } from "react-dom";

import Modal from "../../components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import { InputField } from "../../components/InputField";
import { CircleX } from "lucide-react";

export default function CreateLessonModal({ id, onClose }) {
  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const lessonData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);

    if (lessonData?.lessonName?.trim().length === 0) {
      errors.lessonName = "This field is required.";
    }
    if (lessonData?.order?.trim().length === 0) {
      errors.order = "This field is required.";
    }
    if (lessonData?.lessonUrl?.trim().length === 0) {
      errors.lessonUrl = "This field is required.";
    }
    if (lessonData?.duration?.trim().length === 0) {
      errors.duration = "This field is required.";
    }
    animate(`input`, { borderColor: "#D0D5DD" });
    if (Object.keys(errors)?.length > 0) {
      Object.keys(errors).forEach((key) => {
        animate(
          `#${key}`,
          { x: [-10, 5], borderColor: "#c10007" },
          { type: "spring", duration: 0.7 }
        );
      });

      return { errors: errors, defaultValues: pervData };
    } else {
      try {
        const { error: updateError } = await supabase.from("lessons").insert({
          module_id: id,
          title: lessonData?.lessonName,
          order: lessonData?.order,
          content_url: lessonData?.lessonUrl,
          duration_minutes: lessonData?.duration,
        });

        if (!updateError) {
          console.log("done");
          onClose();
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
  });
  return (
    <Modal title="Add New Lesson" onClose={onClose}>
      <motion.form
        className="flex flex-col gap-6 p-4"
        action={formActions}
        ref={scope}
      >
        <div className="flex items-center gap-4">
          <InputField
            label="lesson Name"
            name="lessonName"
            formState={formState}
            type="text"
            placeHolder="Enter Lesson Name"
          />
          <InputField
            label="Order"
            name="order"
            formState={formState}
            type="number"
            placeHolder="Enter Lesson order (Starts From Zero)"
          />
        </div>
        <div className="flex items-center gap-4">
          <InputField
            label="Lesson Video Url"
            name="lessonUrl"
            formState={formState}
            type="text"
            placeHolder="Enter Lesson Video Url"
          />
          <InputField
            label="Duration"
            name="duration"
            formState={formState}
            type="number"
            placeHolder="Enter Lesson Duration"
          />
        </div>
        {errorMsg && (
          <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
            <CircleX className="w-[18px] text-danger" /> {errorMsg}
          </div>
        )}
        <SubmitButton />
      </motion.form>
    </Modal>
  );
}
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-fit bg-linear-to-r from-[#0179FE] to-[#4893FF] rounded-md p-2 px-4 text-white cursor-pointer font-[inter] ml-auto mr-0"
    >
      {pending ? "Loading..." : "Create"}
    </button>
  );
};

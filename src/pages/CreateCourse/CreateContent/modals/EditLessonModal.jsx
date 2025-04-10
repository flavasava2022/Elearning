import { useAnimate } from "motion/react";
import React, { useActionState, useState } from "react";
import { supabase } from "../../../../utils/supabase";
import toast from "react-hot-toast";
import { useFormStatus } from "react-dom";
import Modal from "../../../../components/Modal";
import { InputField } from "../../../../components/InputField";
import { AnimatePresence, motion } from "framer-motion";

import { CircleX } from "lucide-react";
export default function EditLessonModal({
  id,
  onClose,
  setLessonsData,
  setConfirmedLessonsData,
  item,
}) {
  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const lessonData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);

    if (lessonData?.lessonName?.trim().length === 0) {
      errors.lessonName = "This field is required.";
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
        const { data: newModule, error: updateError } = await supabase
          .from("lessons")
          .update({
            title: lessonData?.lessonName,
            content_url: lessonData?.lessonUrl,
            duration_minutes: lessonData?.duration,
          })
          .eq("id", id)
          .select()
          .single();
        if (!updateError) {
          setLessonsData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, title: newModule?.title } : item
            )
          );
          setConfirmedLessonsData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, title: newModule?.title } : item
            )
          );

          onClose();
          toast.success("Lesson Successfully Updated!");
        } else {
          toast.error("Something Wrong Happened!");
        }
      } catch (updateError) {}
      return {
        errors: null,
        defaultValues: pervData,
      };
    }
  }

  const [formState, formActions] = useActionState(signupActions, {
    errors: null,
    defaultValues: {
      lessonName: item?.title,
      lessonUrl: item?.content_url,
      duration: item?.duration_minutes,
    },
  });
  return (
    <Modal
      title={
        <p className="w-fit bg-primary p-2 text-white rounded-md">
          Edit {item?.title} Module
        </p>
      }
      onClose={onClose}
    >
      <motion.form
        className="flex flex-col gap-6 p-4 w-full"
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
            width={"full"}
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
        <SubmitButton onClose={onClose} />
      </motion.form>
    </Modal>
  );
}
const SubmitButton = ({ onClose }) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex gap-2 ml-auto mr-0">
      <button
        type="button"
        disabled={pending}
        onClick={onClose}
        className="w-fit bg-primary rounded-md p-2 px-4 text-white cursor-pointer font-[inter] "
      >
        Close
      </button>
      <button
        disabled={pending}
        className="w-fit bg-primary rounded-md p-2 px-4 text-white cursor-pointer font-[inter] "
      >
        {pending ? "Loading..." : "Create"}
      </button>
    </div>
  );
};

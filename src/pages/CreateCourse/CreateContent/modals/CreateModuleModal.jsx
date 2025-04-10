import { useAnimate } from "motion/react";
import React, { useActionState, useState } from "react";

import { useFormStatus } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { CircleX } from "lucide-react";

import toast from "react-hot-toast";
import { p } from "motion/react-client";
import { supabase } from "../../../../utils/supabase";
import { InputField } from "../../../../components/InputField";
import Modal from "../../../../components/Modal";

export default function CreateModuleModal({
  id,
  onClose,
  setModulesData,
  setConfirmedModulesData,
  position,
}) {
  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const moduleData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);

    if (moduleData?.moduleName?.trim().length === 0) {
      errors.moduleName = "This field is required.";
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
          .from("modules")
          .insert({
            course_id: id,
            title: moduleData?.moduleName,
            order: position,
          })
          .select()
          .single();
        if (!updateError) {
          toast.success("Module Successfully Added!");
          setModulesData((prev) => [...prev, newModule]);
          setConfirmedModulesData((prev) => [...prev, newModule]);
          onClose();
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
  });
  return (
    <Modal
      title={
        <p className="w-fit bg-primary p-2 text-white rounded-md">
          Add New Module
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
            label="Module Name"
            name="moduleName"
            formState={formState}
            type="text"
            placeHolder="Enter Module Name"
            width="full"
          />
        </div>

        {errorMsg && (
          <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
            {errorMsg}
            <CircleX className="w-[18px] text-danger" />
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

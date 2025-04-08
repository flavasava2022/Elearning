import { AnimatePresence, motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { useAnimate } from "motion/react";
import { useActionState, useState } from "react";

import { useFormStatus } from "react-dom";

import { useNavigate } from "react-router";

import { useSelector } from "react-redux";
import { InputField } from "../../components/InputField";
import { inputValidate } from "../../utils/forms";
import { supabase } from "../../utils/supabase";
import toast from "react-hot-toast";
const LoginForm = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);

  if (user) {
    navigate("/dashboard");
  }

  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const userData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);
    inputValidate(userData, errors);
    animate(`input`, { borderColor: "#D0D5DD" });
    if (Object.keys(errors)?.length > 0) {
      Object.keys(errors).forEach((key) => {
        animate(
          `#${key}`,
          { x: [-10, 5], borderColor: "#c10007" },
          { type: "spring", duration: 0.7 }
        );
      });

      return { errors: errors, defaultValues: userData };
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password,
      });
      if (error) {
        setErrorMsg(error.error_description || error.message);
      } else {
        if (data) {
          setErrorMsg(null);
          navigate("/dashboard");
        }
      }
      return {
        errors: null,
      };
    }
  }

  const [formState, formActions] = useActionState(signupActions, {
    errors: null,
  });
  return (
    <motion.form
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.4,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      className="flex flex-col gap-6"
      action={formActions}
      ref={scope}
    >
      <InputField
        label="Email"
        name="email"
        formState={formState}
        type="text"
        placeHolder="Enter your Email"
        width="full"
      />
      <InputField
        label="Password"
        name="password"
        formState={formState}
        type="password"
        placeHolder="Enter your Password"
        width="full"
      />
      {errorMsg && (
        <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
          <CircleX className="w-[18px] text-danger" /> {errorMsg}
        </div>
      )}
      <SubmitButton />
    </motion.form>
  );
};

export default LoginForm;
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full bg-primary rounded-md p-2 text-white cursor-pointer font-[inter]"
    >
      {pending ? "Loading..." : "Sign in"}
    </button>
  );
};

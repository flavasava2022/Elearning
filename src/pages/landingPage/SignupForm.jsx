import { useActionState, useState } from "react";

import { useAnimate } from "motion/react";
import { supabase } from "../../utils/supabase";
import { useFormStatus } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { CircleX } from "lucide-react";
import { InputField } from "../../components/InputField";
import { inputValidate } from "../../utils/forms";
import { useNavigate } from "react-router-dom";
const SignupForm = () => {
  const navigate = useNavigate();
  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);
  async function signupActions(pervData, formData) {
    const userData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);
    inputValidate(userData, errors);
    animate(`input`, { borderColor: "#D0D5DD" });
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((key) => {
        animate(
          `#${key}`,
          { x: [-10, 5], borderColor: "#c10007" },
          { type: "spring", duration: 0.7 }
        );
      });

      return { errors: errors, defaultValues: userData };
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: userData.role,
          },
        },
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
      className="flex flex-col gap-2"
      action={formActions}
      ref={scope}
    >
      <div className="flex items-center justify-between gap-2">
        <InputField
          label="First Name"
          name="firstName"
          formState={formState}
          type="text"
          placeHolder="Enter your First Name"
        />
        <InputField
          label="Last Name"
          name="lastName"
          formState={formState}
          type="text"
          placeHolder="Enter your Last Name"
        />
      </div>
      <select
        name="role"
        id="Select-role"
        className="border-[#D0D5DD] border-[1px] p-2 rounded-md font-[inter] w-[500px] "
      >
        <option selected disabled>
          Select Role
        </option>
        <option value="student">Student</option>
        <option value="instructor">Instructor</option>
      </select>

      <InputField
        label="Email"
        name="email"
        formState={formState}
        type="text"
        placeHolder="Enter Your Email"
        width="full"
      />
      <div className="flex items-center justify-between gap-4">
        <InputField
          label="Password"
          name="password"
          formState={formState}
          type="password"
          placeHolder="Enter Your Password"
        />
        <InputField
          label="Renter Your Password"
          name="confPassword"
          formState={formState}
          type="password"
          placeHolder="Enter Your Password"
        />
      </div>
      {errorMsg && (
        <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
          <CircleX className="w-[18px] text-danger" /> {errorMsg}
        </div>
      )}
      <SubmitButton />
    </motion.form>
  );
};

export default SignupForm;
const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="w-full bg-primary rounded-md p-2 text-white cursor-pointer font-[inter]"
    >
      {pending ? "Loading..." : "Sign up"}
    </button>
  );
};

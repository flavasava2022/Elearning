import React, { useActionState, useEffect, useState } from "react";
import { inputValidate } from "../../utils/forms";
import { useAnimate } from "motion/react";

import { useFormStatus } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { supabase, uploadFile } from "../../utils/supabase";

import * as motion from "motion/react-client";

import { useSidebar } from "../../context/SidebarContext";
import { getUserProfile } from "../../store/user-slice";
import { InputField } from "../../components/InputField";
import { CircleX } from "lucide-react";
import UploadButton from "../../components/UploadButton";
export default function MyDetails() {
  const user = useSelector((state) => state?.user?.userData);
  const dispatch = useDispatch();
  const { isMobile } = useSidebar();
  const [data, setData] = useState([]);
  const [scope, animate] = useAnimate();
  const [errorMsg, setErrorMsg] = useState(null);

  const deleteImage = async () => {
    const { data, error } = await supabase.storage
      .from("profile-pic")
      .remove([`${user.email}_profile-pic.jpg`]);

    if (error) {
      console.error("Delete error:", error.message);
    } else {
      console.log("Deleted:", data);
    }
  };
  useEffect(() => {
    setData(user);
  }, [user]);
  async function signupActions(pervData, formData) {
    const userData = Object.fromEntries(formData);
    let errors = {};
    setErrorMsg(null);
    userData.email = user?.email;
    inputValidate(userData, errors);

    animate(`input`, { borderColor: "#D0D5DD" });

    if (Object.keys(errors)?.length > 0) {
      console.log("ffff");
      Object.keys(errors).forEach((key) => {
        animate(
          `#${key}`,
          { x: [-10, 5], borderColor: "#c10007" },
          { type: "spring", duration: 0.7 }
        );
      });

      return {
        errors: errors,
        defaultValues: userData,
      };
    } else {
      console.log(userData);
      const fileName = `${user.email}_profile-pic`;
      if (userData?.pic?.size > 0) {
        try {
          const url = await uploadFile(userData.pic, fileName);
          if (url) {
            const { error: updateError } = await supabase
              .from("users")
              .update({
                first_name: userData?.firstName,
                last_name: userData?.lastName,
                avatar_url: url,
                city: userData.city,
                phone_number: userData?.phone,
              })
              .eq("id", user?.id);

            if (!updateError) {
              dispatch(getUserProfile(user?.id));
            }
          }
        } catch (err) {
          console.error("Error uploading file:", err);
        }
      } else {
        const { error: updateError } = await supabase
          .from("users")
          .update({
            first_name: userData?.firstName,
            last_name: userData?.lastName,
            city: userData.city,
            phone_number: userData?.phone,
          })
          .eq("id", user?.id);

        if (!updateError) {
          dispatch(getUserProfile(user?.id));
        }
      }
    }

    return {
      errors: null,
      defaultValues: pervData,
    };
  }

  const [formState, formActions] = useActionState(signupActions, {
    errors: null,
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      email: user?.email,
      role: user?.role,
      city: user?.city,
      phone: user?.phone_number,
    },
  });

  return (
    <div className="bg-white w-full p-4 h-full rounded-xl  flex flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <p className="text-[1.5rem] font-semibold" onClick={deleteImage}>
          My Details
        </p>
        <span className="font-semibold">
          Please fill full details about yourself
        </span>
      </div>
      <form
        className="flex flex-col gap-6 p-2"
        action={formActions}
        ref={scope}
      >
        <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap">
          {" "}
          <InputField
            label="First Name"
            name="firstName"
            formState={formState}
            type="text"
            placeHolder="Enter your First Name"
            width={isMobile ? "full" : null}
          />
          <InputField
            label="Last Name"
            name="lastName"
            formState={formState}
            type="text"
            placeHolder="Enter your Last Name"
            width={isMobile ? "full" : null}
          />
        </div>
        <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap">
          {" "}
          <InputField
            label="Email"
            name="email"
            formState={formState}
            type="email"
            placeHolder="Enter your Email"
            width={isMobile ? "full" : null}
            disabled
          />
          <InputField
            label="Phone Number"
            name="phone"
            formState={formState}
            type="text"
            placeHolder="Enter your Phone Number"
            width={isMobile ? "full" : null}
          />
        </div>
        <div className="flex justify-between gap-6 flex-wrap md:flex-nowrap items-center">
          {" "}
          <InputField
            label="City"
            name="city"
            formState={formState}
            type="text"
            placeHolder="Enter your City"
            width={isMobile ? "full" : null}
          />
          <div
            className={`flex flex-col gap-2 ${
              isMobile ? "w-full" : "w-[50%]"
            }  justify-start h-[90px]`}
          >
            <label htmlFor="role" className="text-[14px]  font-bold">
              Role
            </label>
            <select
              name="role"
              className="border-[#D0D5DD] border-[1px] rounded-md font-[inter] w-full  p-3"
            >
              <option disabled>Select Role</option>
              <option
                value="student"
                selected={formState?.defaultValues?.role === "student"}
              >
                Student
              </option>
              <option
                value="instructor"
                selected={formState?.defaultValues?.role === "instructor"}
              >
                Instructor
              </option>
            </select>
          </div>
        </div>

        <p className="font-semibold ">Your Photo</p>

        <UploadButton user={user} />

        {errorMsg && (
          <div className="flex  items-center gap-2 p-2  bg-red-500 text-white rounded-lg">
            <CircleX className="w-[18px] text-danger" />
          </div>
        )}
        <SubmitButton />
      </form>
    </div>
  );
}

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <motion.button
      disabled={pending}
      className="w-fit bg-[#d9e6fe] rounded-md p-2 px-6 text-white cursor-pointer mr-0 ml-auto mt-2"
      whileHover={{
        backgroundColor: "#7b9fe7",
        transition: { duration: 0.3 },
      }}
    >
      {pending ? "Loading..." : "Save Changes"}
    </motion.button>
  );
};

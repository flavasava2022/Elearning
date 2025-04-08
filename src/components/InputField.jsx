import { CircleX } from "lucide-react";
export const InputField = ({
  label,
  name,
  formState,
  type,
  placeHolder,
  width,
  disabled,
}) => {
  return (
    <div
      className={`${
        width === "full" ? "w-full" : "w-[50%]"
      } flex flex-col gap-2`}
    >
      <label htmlFor={name} className="text-[14px]  font-bold">
        {label}
      </label>
      <p className="flex flex-col gap-2">
        {type === "textarea" ? (
          <textarea
            name={name}
            placeholder={placeHolder}
            className="border-[#D0D5DD] border-[1px] p-2 rounded-md font-[inter] w-full outline-0 min-h-[120px] max-h-[120px]"
            defaultValue={formState?.defaultValues?.[name]}
            id={name}
            disabled={disabled}
          ></textarea>
        ) : (
          <input
            type={type}
            name={name}
            max={40}
            placeholder={placeHolder}
            className="border-[#D0D5DD] border-[1px] p-2 rounded-md font-[inter] w-full outline-0"
            defaultValue={formState?.defaultValues?.[name]}
            id={name}
            disabled={disabled}
          />
        )}

        <span
          className={`h-[10px] ${
            formState?.errors?.[name] ? " flex" : "opacity-0"
          } transition-all transition-discrete duration-200  text-red-700 text-[12px] items-center p-1 capitalize gap-1`}
        >
          {formState?.errors?.[name] && (
            <CircleX className="w-[18px] text-danger" />
          )}
          <span>{formState?.errors?.[name]} </span>{" "}
        </span>
      </p>
    </div>
  );
};

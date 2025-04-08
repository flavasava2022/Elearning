import React, { useState } from "react";
import { motion } from "framer-motion";
import { CircleX, Upload } from "lucide-react";

const ImageUpload = ({ courseData, formState }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Generate a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  return (
    <div className="flex items-center  gap-2 md:flex-nowrap flex-wrap justify-center md:justify-between flex-col">
      <motion.label
        htmlFor="pic"
        style={{ cursor: "pointer" }}
        className="w-full bg-[#d9e6fe] h-[200px] rounded-xl flex items-center justify-center flex-col gap-2 relative"
        whileHover={{
          backgroundColor: "#7b9fe7",
          transition: { duration: 0.3 },
        }}
      >
        {previewUrl || courseData?.image_url ? (
          <img
            src={previewUrl ? previewUrl : courseData?.image_url}
            alt="Profile"
            className="w-[195px] h-[195px] max-h-full  max-w-full rounded-xl"
          />
        ) : (
          <>
            <Upload className="w-[30px]" />
            <p className="text-[13px] text-black">
              Click to upload or drag and drop
            </p>
          </>
        )}
      </motion.label>
      <input
        type="file"
        id="pic"
        name="pic"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <span
        className={`h-[10px] ${
          formState?.errors?.pic ? " flex" : "opacity-0"
        } transition-all transition-discrete duration-200  text-red-700 text-[12px] items-center p-1 capitalize gap-1`}
      >
        {formState?.errors?.pic && <CircleX className="w-[12px] text-danger" />}
        <span>{formState?.errors?.pic} </span>{" "}
      </span>
    </div>
  );
};

export default ImageUpload;

import React, { useState } from "react";
import { motion } from "framer-motion";

import avatarIcon from "../assets/young-man-avatar-svgrepo-com.svg";
import { Upload } from "lucide-react";
const UploadButton = ({ user }) => {
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
    <div className="flex items-center  gap-2 md:flex-nowrap flex-wrap justify-center md:justify-between">
      <img
        src={
          previewUrl
            ? previewUrl
            : user?.avatar_url
            ? user?.avatar_url
            : avatarIcon
        }
        alt="Profile"
        className="w-[120px] h-[120px] max-h-full  max-w-full rounded-full"
      />
      <motion.label
        htmlFor="pic"
        style={{ cursor: "pointer" }}
        className="md:w-[90%] w-full bg-[#d9e6fe] h-[150px] rounded-xl flex items-center justify-center flex-col gap-2 relative"
        whileHover={{
          backgroundColor: "#7b9fe7",
          transition: { duration: 0.3 },
        }}
      >
        <Upload className="w-[30px]" />
        <p className="text-[13px] text-black">
          Click to upload or drag and drop
        </p>
        <p className="text-[13px] text-black">
          SVG, PNG, JPEG OR GIF (max 1080px1200px)
        </p>
      </motion.label>
      <input
        type="file"
        id="pic"
        name="pic"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadButton;

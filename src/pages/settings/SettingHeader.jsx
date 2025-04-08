import React from "react";
import SettingsNav from "./SettingsNav";
import { useSelector } from "react-redux";
import avatarIcon from "../../assets/young-man-avatar-svgrepo-com.svg";
import { Calendar1, MapPinPlusInside } from "lucide-react";
export default function SettingHeader() {
  const user = useSelector((state) => state?.user?.userData);
  const dateStr = user?.created_at?.split(" ")[0];

  const date = new Date(dateStr);

  // Options for formatting
  const options = { year: "numeric", month: "long" };

  // Convert to desired format
  const formattedDate = date.toLocaleDateString("en-US", options);
  return (
    <div className="bg-white rounded-xl w-full md:h-[220px] h-[320px] shadow flex flex-col justify-between">
      <div className="w-full flex h-full md:flex-nowrap flex-wrap">
        <div className="flex items-center gap-2 md:px-8 md:h-full p-3  justify-center md:w-[15%] w-full ">
          <img
            src={user?.avatar_url ? user?.avatar_url : avatarIcon}
            alt="Profile"
            className="w-[120px] h-[120px] max-h-full max-w-full rounded-full"
          />
        </div>
        <div className=" w-full h-full flex flex-col gap-1 md:justify-center  items-center md:items-start">
          <p className="font-bold text-[1.5rem] p-2 capitalize">
            {user?.first_name} {user?.last_name}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MapPinPlusInside />
              <span className=" capitalize">
                {user?.city ? user?.city : "egypt"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar1 />
              <span>Join {formattedDate}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-2">
        <SettingsNav />
      </div>
    </div>
  );
}

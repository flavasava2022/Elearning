import React from "react";
import { Outlet } from "react-router-dom";
import SettingsHeader from "./SettingHeader";

export default function SettingsLayout() {
  return (
    <div className="flex flex-col gap-8 p-2 ">
      <SettingsHeader />

      <Outlet />
    </div>
  );
}

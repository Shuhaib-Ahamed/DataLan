import { Breadcrumb } from "flowbite-react";
import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import UserProfileUpload from "../../components/ui/Settings/UserProfileUpload";

const SettingsScreen = () => {
  return (
    <DashboardLayout>
      <div class="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900 py-4 px-10">
        <div class="mb-4 col-span-full">
          <Breadcrumb>
            <Breadcrumb.Item icon={AiFillHome}>
              <NavLink to="/">Home</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to="/settings">Settings</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1 class="text-3xl mt-4 font-semibold text-gray-900">Settings</h1>
        </div>
        <UserProfileUpload />
      </div>
    </DashboardLayout>
  );
};

export default SettingsScreen;

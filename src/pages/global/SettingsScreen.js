import { Breadcrumb } from "flowbite-react";
import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import UserProfileUpload from "../../components/ui/Settings/UserProfileUpload";
import UserProfileForm from "../../components/ui/Settings/UserProfileForm";

const SettingsScreen = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900 py-4 px-10">
        <div className="mb-4 col-span-full">
          <Breadcrumb>
            <Breadcrumb.Item icon={AiFillHome}>
              <NavLink to="/">Home</NavLink>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <NavLink to="/settings">Settings</NavLink>
            </Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="text-3xl mt-4 font-semibold text-gray-900">
            Settings
          </h1>
        </div>
        <div className="col-span-full xl:col-auto">
          <UserProfileUpload />
        </div>

        <div className=" mb-4 col-span-2">
          <UserProfileForm />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsScreen;

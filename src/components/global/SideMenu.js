import React from "react";
import SideButton from "../ui/Sidebar/SideButton";

const SideMenu = () => {
  return (
    <div className="p-4 mt-16 relative">
      <div className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal duration-75 lg:flex transition-width">
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1 bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              <ul className="py-4 space-y-2">
                <li>
                  <SideButton
                    to="/dashboard"
                    name="Dashboard"
                    icon="ic:round-space-dashboard"
                  />
                </li>
                <li>
                  <SideButton
                    to="/assets"
                    name="Assets"
                    icon="ic:baseline-wb-cloudy"
                  />
                </li>
                <li>
                  <SideButton
                    to="/marketplace"
                    name="Marketplace"
                    icon="icon-park-outline:market"
                  />
                </li>
                <li>
                  <SideButton
                    to="/requests"
                    name="Requests"
                    icon="bi:people-fill"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;

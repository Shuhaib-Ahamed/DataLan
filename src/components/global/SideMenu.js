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
                    to="/"
                    name="Home"
                    icon={
                      <svg
                        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
                      >
                        <path
                          fill="currentColor"
                          fill-rule="evenodd"
                          d="m24 3l.349.003C35.726 3.189 45 12.468 45 24.074l-.003.35C44.81 35.837 35.42 45 24 45l-.349-.003C12.274 44.811 3 35.532 3 24.074C3 12.349 12.464 3 24 3Zm14.38 22.387l-17.313 4.337c-.164.04-.328.06-.49.06l-.188-.009a2.013 2.013 0 0 1-1.16-.512l-1.688 5.878l-.023.13c-.21 1.517 1.56 2.757 3.399 1.82L36.9 27.996l.191-.115c1.111-.7 1.538-1.623 1.288-2.495Zm-20.4-12.609c-1.21-.927-3.159-.015-3.266 2.042l-.116 18.389c-.009 1.44.591 2.354 1.52 2.585l4.901-17.16l.055-.165a2.004 2.004 0 0 1 1.263-1.196l-4.246-4.403l-.111-.092Zm3.082-1.498c-1.163-.612-2.175-.52-2.805.132L30.67 24.236c.484.5.656 1.19.52 1.823l5.935-1.477l.135-.05c1.408-.584 1.592-2.728-.135-3.849l-15.867-9.295l-.195-.108Z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    }
                  />
                </li>
                <li>
                  <SideButton
                    to="/dashboard"
                    name="Dashboard"
                    icon={
                      <svg
                        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M9 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2zm6 0h4c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2zm6-13V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2z"
                        />
                      </svg>
                    }
                  />
                </li>
                <li>
                  <SideButton
                    to="/assets"
                    name="Assets"
                    icon={
                      <svg
                        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19.36 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5c0-2.64-2.05-4.78-4.64-4.96z"
                        />
                      </svg>
                    }
                  />
                </li>
                <li>
                  <SideButton
                    to="/requests"
                    name="Requests"
                    icon={
                      <svg
                        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="currentColor"
                          d="M7 14s-1 0-1-1s1-4 5-4s5 3 5 4s-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6a3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5Z"
                        />
                      </svg>
                    }
                  />
                </li>
                <li>
                  <SideButton
                    to="/training"
                    name="Model Training"
                    icon={
                      <svg
                        className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M11.883.002a12.044 12.044 0 0 0-9.326 19.463l3.668-2.694A7.573 7.573 0 0 1 12.043 4.45v2.867l6.908-5.14A12.012 12.012 0 0 0 11.883.002zm9.562 4.533L17.777 7.23a7.573 7.573 0 0 1-5.818 12.322v-2.867l-6.908 5.14a12.046 12.046 0 0 0 16.394-17.29z"
                        />
                      </svg>
                    }
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

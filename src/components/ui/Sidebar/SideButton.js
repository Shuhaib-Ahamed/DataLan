import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

const SideButton = ({ icon, name, to }) => {
  return (
    <NavLink
      to={to}
      className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <>{icon}</>
      {/* <Icon color="#1F2937" icon={icon} width="28" height="28" /> */}
      <span className="ml-3">{name}</span>
    </NavLink>
  );
};

export default SideButton;

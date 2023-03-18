import { Breadcrumb } from "flowbite-react";
import React from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout"; // Icons
import { AiFillHome } from "react-icons/ai";

const AutoMLTrain = () => {
  return (
    <DashboardLayout>
      <div class="mb-4 py-4 px-10 ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/"> Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/training">Training</NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 class="text-3xl mt-4 font-semibold text-gray-900">Train Datasets</h1>
      </div>
    </DashboardLayout>
  );
};

export default AutoMLTrain;

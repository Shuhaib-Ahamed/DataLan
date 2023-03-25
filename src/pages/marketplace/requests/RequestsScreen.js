import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout"; // Icons
import { AiFillHome } from "react-icons/ai";
import RequestsTable from "./RequestsTable";
import RequestHeader from "./RequestHeader";

const RequestsScreen = () => {
  const [type, setType] = useState(0);
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/"> Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Requests</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-3xl my-4 font-semibold text-gray-900">Requests</h1>{" "}
        <RequestHeader setType={setType} type={type} />
        <RequestsTable type={type} />
      </div>
    </DashboardLayout>
  );
};

export default RequestsScreen;

import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout"; // Icons
import { AiFillHome } from "react-icons/ai";
import RequestsTable from "./RequestsTable";
import RequestHeader from "./RequestHeader";
import Banner from "../../../components/ui/Banner";

const RequestsScreen = () => {
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/"> Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Requests</Breadcrumb.Item>
        </Breadcrumb>
        <Banner
          highLight="Requests"
          content="Here at AutoCS we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        />
        <RequestsTable />
      </div>
    </DashboardLayout>
  );
};

export default RequestsScreen;

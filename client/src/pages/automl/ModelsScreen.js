import { Breadcrumb } from "flowbite-react";
import React from "react";
import { AiFillHome } from "react-icons/ai";
import { NavLink, useLocation } from "react-router-dom";
import Banner from "../../components/ui/Banner";
import DashboardLayout from "../../layouts/DashboardLayout";
import ModelTable from "./ModelTable";

const ModelsScreen = () => {
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Models</Breadcrumb.Item>
        </Breadcrumb>
        <Banner
          highLight="Models"
          content="Here at AutoCS we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        />
        <ModelTable />
      </div>
    </DashboardLayout>
  );
};

export default ModelsScreen;

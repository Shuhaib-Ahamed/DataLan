import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import AssetHeader from "../../../components/ui/Assets/AssetHeader";
import Drawer from "../../../components/global/Drawer";

const AssetsScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/assets">Assets</NavLink>
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-3xl my-4 font-semibold text-gray-900">Assets</h1>
        <AssetHeader setIsOpen={setIsOpen} />
        <Drawer
          header="Add New Asset"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={loading}
        ></Drawer>
      </div>
    </DashboardLayout>
  );
};

export default AssetsScreen;

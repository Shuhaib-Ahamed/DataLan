import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import AssetHeader from "../../../components/ui/Assets/AssetHeader";
import Drawer from "../../../components/global/Drawer";
import AssetForm from "./AssetForm";
import AssetTable from "./AssetTable";

const AssetsScreen = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 flex flex-col ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Assets</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-3xl my-4 font-semibold text-gray-900">Assets</h1>
        <AssetHeader setIsOpen={setIsOpen} setRefresh={setRefresh} />
        <Drawer
          header="Add New Asset"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={loading}
        >
          <AssetForm
            setLoading={setLoading}
            loading={loading}
            setIsOpen={setIsOpen}
            setRefresh={setRefresh}
          />
        </Drawer>
        <AssetTable refresh={refresh} />
      </div>
    </DashboardLayout>
  );
};

export default AssetsScreen;

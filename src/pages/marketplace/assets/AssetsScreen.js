import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import Drawer from "../../../components/global/Drawer";
import AssetForm from "./AssetForm";
import AssetTable from "./AssetTable";
import AssetHeader from "./AssetHeader";
import Banner from "../../../components/ui/Banner";

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
        <Banner
          highLight="Assets"
          content="Here at AutoCS we focus on markets where technology, innovation, and capital can unlock long-term value and drive economic growth."
        />
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
        <AssetTable
          refresh={refresh}
          setIsOpen={setIsOpen}
          setRefresh={setRefresh}
        />
      </div>
    </DashboardLayout>
  );
};

export default AssetsScreen;

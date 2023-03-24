import { Breadcrumb } from "flowbite-react";
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";

const ViewAssetScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  let location = useLocation();
  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 flex flex-col ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/assets">Assets</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item># {location.state?.asset?._id}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-3xl my-4 font-semibold text-gray-900">View Asset</h1>

        {/* <Drawer
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
        </Drawer> */}
      </div>
    </DashboardLayout>
  );
};

export default ViewAssetScreen;

import React from "react";
import Footer from "../components/global/Footer";
import Nav from "../components/global/Nav";
import SideMenu from "../components/global/SideMenu";

const DashboardLayout = ({ children }) => {
  return (
    <React.Fragment>
      <Nav />
      <div className="flex overflow-hidden bg-gray-50 dark:bg-gray-900">
        <SideMenu />
        <div className="relative h-full pt-20 pb-10 w-full overflow-y-auto bg-gray-50 lg:ml-56 dark:bg-gray-900">
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </React.Fragment>
  );
};

export default DashboardLayout;

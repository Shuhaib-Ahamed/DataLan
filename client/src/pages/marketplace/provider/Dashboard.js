import { Breadcrumb } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import stellarService from "../../../services/web3/stellarService";
import { useSelector } from "react-redux";
import AnimatedNumber from "animated-number-react";
import { dev } from "../../../config";
import PaymentsTable from "./PaymentsTable";
import StellarSdk from "stellar-sdk";

var stellarConnection = new StellarSdk.Server(dev.setllarURL);

const Dashboard = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [account, setAccount] = useState(null);

  const formatValue = (value) => `${Number(value).toFixed(2)}`;

  useEffect(() => {
    const getAccount = async () => {
      try {
        const res = await stellarService.getAccountById(
          currentUser?.publicKey,
          stellarConnection
        );

        if (res) {
          setAccount(res);
        }
      } catch (error) {}
    };

    getAccount();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-3xl mt-4 font-semibold text-gray-900">Dashboard</h1>
        <div className=" my-6  bg-white rounded-lg shadow md:flex md:items-center md:justify-between dark:bg-gray-800">
          <div className="flex flex-col w-full ">
            <div className="flex flex-col  border rounded-lg bg-gray-800 ">
              <div className="flex items-start justify-between">
                <div className="p-8">
                  <h3 className="text-3xl font-semibold  text-white">
                    Stellar Account Balance
                  </h3>
                  <p className="mt-2 text-gray-400 text-xs">
                    {currentUser?.publicKey}
                  </p>
                  <a
                    target="_blank"
                    className="inline-flex items-center justify-center gap-2 mt-5 text-sm font-medium text-blue-500 hover:text-blue-700"
                    href={
                      dev.setllarURL + "/accounts/" + currentUser?.publicKey
                    }
                  >
                    View in Stellar Laboratory
                    <svg
                      className="w-2.5 h-auto"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 1L10.6869 7.16086C10.8637 7.35239 10.8637 7.64761 10.6869 7.83914L5 14"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                      />
                    </svg>
                  </a>
                </div>
                <div className="flex items-center justify-center w-1/2 p-8">
                  <div className="flex gap-3 items-end">
                    <h1 className="font-bold text-7xl text-white">
                      {account?.balances?.length > 0 ? (
                        <AnimatedNumber
                          value={account?.balances[0]?.balance}
                          formatValue={formatValue}
                          duration={1000}
                        />
                      ) : (
                        "..."
                      )}
                    </h1>
                    <p className="text-gray-400">LUMENS</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8">
              <PaymentsTable />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

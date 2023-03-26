import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import assetService from "../../../services/asset/assetService";
import { SiHiveBlockchain } from "react-icons/si";
import { Badge, Spinner } from "flowbite-react";
import { SiStellar } from "react-icons/si";
import { NavLink } from "react-router-dom";
import AssetHeader from "./AssetHeader";

const AssetTable = ({ refresh, setIsOpen, setRefresh }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(null);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await assetService.getAssetByPublicKey(
          currentUser?.publicKey
        );
        if (res.status === 200) {
          setAssets(res.data.data);
        }
      } catch (error) {
        console.log(error);
        // toast.error("Error while fetching assets");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, [refresh]);

  return (
    <div className=" bg-white  block ">
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg shadow">
          {" "}
          <AssetHeader setIsOpen={setIsOpen} setRefresh={setRefresh} />
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                {loading ? (
                  <React.Fragment>
                    <tbody>
                      <tr className="p-4 flex  items-center justify-center">
                        <td>
                          <Spinner size="lg" />
                        </td>
                      </tr>
                    </tbody>
                  </React.Fragment>
                ) : assets?.length === 0 ? (
                  <React.Fragment>
                    <div className="flex flex-col justify-center items-center pt-16 pb-6 mx-auto dark:bg-gray-900">
                      <div className="text-center">
                        <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                          No Assets Found!!
                        </h1>
                        <p className="text-base font-base text-gray-500  dark:text-gray-400">
                          You can try adding you own assets to the marketplace
                        </p>
                      </div>
                      <div className="block max-w-sm">
                        <img
                          src="https://flowbite-admin-dashboard.vercel.app/images/illustrations/500.svg"
                          alt="astronaut image"
                        />
                      </div>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr colSpan="4">
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Asset Name
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {assets?.length > 0 &&
                        assets.map((asset, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <td className="p-4 text-sm font-normal text-gray-500 whitespace-nowrap dark:text-gray-400">
                              <span className="text-base font-semibold text-gray-900 dark:text-white">
                                {asset?.assetTitle?.split("-")[0]}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs overflow-hidden text-base font-normal text-gray-500 truncate dark:text-gray-400">
                              {asset?.assetDescription}
                            </td>

                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <div className="flex gap-1 items-center">
                                {asset?.assetAmount} <SiStellar size="15" />
                              </div>
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <Badge
                                className="flex items-center justify-center"
                                color="success"
                              >
                                {asset?.status}
                              </Badge>
                            </td>
                            <td className="p-4 space-x-4 whitespace-nowrap">
                              <NavLink
                                className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                to={`/assets/${asset?._id}`}
                                state={{ asset: asset }}
                              >
                                View Asset
                              </NavLink>
                              <button className=" inline-flex items-center py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                <SiHiveBlockchain className="w-4 h-4 mr-2" />{" "}
                                View on Blockchain
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </React.Fragment>
                )}
              </table>
            </div>
            <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.ceil(assets?.length / 2) + " - " + assets?.length}{" "}
                  </span>
                  of{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {assets?.length}
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  <svg
                    class="w-5 h-5 mr-1 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>{" "}
                  Previous
                </button>
                <button className="inline-flex w-24 items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                  Next{" "}
                  <svg
                    class="w-5 h-5 ml-1 -mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;

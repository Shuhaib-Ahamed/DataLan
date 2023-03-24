import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import assetService from "../../../services/asset/assetService";
import { SiHiveBlockchain } from "react-icons/si";
import { BiTransferAlt } from "react-icons/bi";
import { Badge, Spinner } from "flowbite-react";
import { SiStellar } from "react-icons/si";

const AssetTable = ({ refresh }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await assetService.getAssetByPublicKey(currentUser.publicKey);
      if (res.status === 200) {
        setAssets(res.data.data);
      }
    } catch (error) {
      toast.error("Error while fetching assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [refresh]);

  return (
    <div className=" bg-white  block ">
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg shadow">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                {loading ? (
                  <React.Fragment>
                    <tr className="p-4 flex  items-center justify-center">
                      <td>
                        <Spinner size="lg" />
                      </td>
                    </tr>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr colspan="4">
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
                              <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                              >
                                <BiTransferAlt className="w-4 h-4 mr-2" />
                                Transfer
                              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;

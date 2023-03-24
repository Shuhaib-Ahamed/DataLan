import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomCard from "../../components/global/CustomCard";
import SkeletonCard from "../../components/global/SkeletonCard";
import Search from "../../components/ui/Search";
import assetService from "../../services/asset/assetService";

const Marketplace = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(null);
  const dummyArr = Array.from({ length: 6 });

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await assetService.getAssets();
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
  }, []);

  return (
    <div className="p-6 my-6 mx-10 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl flex flex-col gap-2 font-semibold text-gray-900 ">
            Marketplace
            <span className="text-base font-normal text-gray-500 dark:text-gray-400">
              Latest datasets and models
            </span>
          </h1>
          <div className="flex gap-4 items-center">
            <button
              className="mr-4 inline-flex items-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              Filter by latest
              <svg
                className="w-4 h-4 ml-2"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            <Search />
          </div>
        </div>

        <div className="grid grid-cols-1 mb-8 mt-16 xl:grid-cols-3 gap-10 dark:bg-gray-900">
          {loading
            ? dummyArr.length > 0 &&
              dummyArr.map((_, index) => <SkeletonCard key={index} />)
            : assets &&
              assets.length > 0 &&
              assets.map((asset, index) => (
                <CustomCard
                  key={index}
                  index={index}
                  title={asset?.assetTitle}
                  description={asset.assetDescription}
                  amount={asset?.assetAmount}
                  id={asset?._id}
                  rating={4.5}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

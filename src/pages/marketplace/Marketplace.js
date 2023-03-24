import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CustomCard from "../../components/global/CustomCard";
import assetService from "../../services/asset/assetService";

const Marketplace = () => {
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await assetService.getAssets();
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
  }, []);

  return (
    <div className="p-6 my-6 mx-10 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
      <div className="flex flex-col">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Marketplace
        </h1>

        <div className="grid grid-cols-1 my-6 xl:grid-cols-3 gap-10 dark:bg-gray-900">
          {assets &&
            assets.length > 0 &&
            assets?.map((asset, index) => (
              <CustomCard
                key={index}
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

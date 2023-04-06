import React, { useCallback, useEffect, useState } from "react";
import ReactMultiSelect from "../../components/global/MultiSelect";
import PrimaryButton from "../../components/ui/PrimaryButton";
import assetService from "../../services/asset/assetService";
import { Badge } from "flowbite-react";

const TrainingForm = () => {
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedColumn, setSelectedColumn] = useState([]);
  const [assets, setAssets] = useState([]);
  const [columns, setCloumns] = useState([]);

  useEffect(() => {
    const getOwnedAssets = useCallback(async () => {
      try {
        setLoading(true);
        const getOwnedAssets = await assetService.getAssets();

        if (getOwnedAssets.status === 200) {
          let dummyArr = [];
          let columnArr = [];
          getOwnedAssets?.data?.data?.map((asset) => {
            dummyArr.push({
              value: asset,
              label: asset?.assetTitle?.split("-")[0],
            });

            return setAssets(dummyArr);
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, []);
    getOwnedAssets();
  }, []);

  useEffect(() => {
    const getColumnNames = () => {
      let cloumnArr = [];
      selectedAsset?.value?.columns?.map((column) => {
        cloumnArr.push({
          value: column,
          label: column,
        });
        return setCloumns(cloumnArr);
      });
    };
    getColumnNames();
  }, [selectedAsset]);

  return (
    <div className="my-6 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
      <div className="flex flex-col space-y-4 mb-6 mt-2 w-full">
        <div className="mb-2">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-900">
              Select and Train Datasets
            </h3>
            <Badge color="gray">
              <p className="text-sm font-medium text-gray-700">Preprocessed</p>
            </Badge>
          </div>

          <p className="text-base font-normal mt-4 text-gray-500">
            Welcome to our state-of-the-art AutoML training platform! Our
            platform is designed to make machine learning accessible to
            everyone, regardless of their technical expertise or level of
            experience. With our intuitive interface, you can easily select and
            train your dataset using the latest AutoML technologies, without
            having to worry about the complexities of coding and algorithm
            selection.
          </p>
        </div>
        <div className="flex flex-col w-full mb-2">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Asset
          </label>
          <ReactMultiSelect
            data={assets}
            name="asset"
            isLoading={loading}
            setLoading={setLoading}
            setSelected={setSelectedAsset}
            selected={selectedAsset}
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Select Target Column
          </label>
          <ReactMultiSelect
            data={columns}
            name="asset"
            isDisabled={!selectedAsset}
          />
        </div>
        <div className="flex items-center justify-end w-full space-x-4 pt-12">
          <PrimaryButton
            disabled={loading}
            content="Train Dataset"
            status="Authenticating"
            loading={loading}
            setSelected={setSelectedColumn}
            selected={selectedColumn}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainingForm;

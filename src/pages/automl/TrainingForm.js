import React, { useCallback, useEffect, useState } from "react";
import ReactMultiSelect from "../../components/global/MultiSelect";
import PrimaryButton from "../../components/ui/PrimaryButton";
import assetService from "../../services/asset/assetService";
import { Badge } from "flowbite-react";
import { toast } from "react-toastify";
import CredentialModal from "../../components/global/CredentialModal";
import { ENCRYPTION } from "../../enum";
import encryptor from "../../utils/encryptor";
import chainService from "../../services/web3/chainService";
import autoMLService from "../../services/automl/automlService";
import { useDispatch, useSelector } from "react-redux";
import { clearMessage, setMessage } from "../../redux/slices/message";

const TrainingForm = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [loadingAsset, setLoadingAsset] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState();
  const [selectedColumn, setSelectedColumn] = useState([]);
  const [assets, setAssets] = useState([]);
  const [columns, setCloumns] = useState([]);
  const [isDecryptOpen, setIsDecryptOpen] = useState(false);
  const [keyPair, setCredentials] = useState({
    publicKey: "",
    privateKey: "",
  });

  const trainAsset = async (asset) => {
    setLoading(true);
    let decryptedAssetData = null;
    let parsedData = null;

    if (!selectedColumn || !selectedAsset) {
      toast.error("Please select asset and column");
    }
    try {
      dispatch(setMessage("Decrypting asset!!!"));

      await assetService.getAssetByID(asset?._id).then(async (response) => {
        const asset = response?.data?.data;
        if (asset) {
          // Decrypt the file
          if (asset?.encryptionType === ENCRYPTION.AES) {
            decryptedAssetData = encryptor.symmetricDecryption(
              asset?.assetData,
              keyPair?.privateKey
            );
          } else if (asset?.encryptionType === ENCRYPTION.RSA) {
            decryptedAssetData = encryptor.asymmetricDecryption(
              JSON.parse(asset.assetData),
              keyPair?.privateKey
            );
          }
          parsedData = JSON.parse(decryptedAssetData);
          dispatch(setMessage("Fetching Transaction!!!"));
          await chainService
            .getWeb3AssetById(parsedData?.assetId)
            .then(async (encModel) => {
              if (encModel) {
                dispatch(setMessage("Runing computations!!!"));
                await sendData(
                  encModel,
                  keyPair?.privateKey,
                  parsedData,
                  asset?.encryptionType
                );
              } else throw new Error("Asset not found");
            });
        }
      });
    } catch (error) {
      console.log(error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setLoading(false);
      setIsDecryptOpen(false);
      dispatch(clearMessage());
    }
  };

  const sendData = (encModel, privateKey, parsedData, type) => {
    return new Promise(async (resolve, reject) => {
      try {
        let decryptedBuffer = null;
        if (!encModel || !privateKey || !type) {
          reject("Invalid Arguments");
        }
        // // Decrypt the file
        if (type === ENCRYPTION.AES) {
          decryptedBuffer = encryptor.symmetricDecryption(encModel, privateKey);
        } else if (type === ENCRYPTION.RSA) {
          parsedData.encryptionObject.encryptedData = encModel;

          decryptedBuffer = encryptor.asymmetricDecryption(
            parsedData?.encryptionObject,
            privateKey
          );
        }
        if (decryptedBuffer === null) reject("Invalid Encryption Model!!!");

        const decryptedFile = new Blob([decryptedBuffer], {
          type: "text/csv;charset=utf-8;",
        });

        if (decryptedFile) {
          const form = new FormData();
          form.append("file", decryptedFile);
          form.append("target_column", selectedColumn?.value);

          const train = await autoMLService.trainDataSet(form);

          if (train.status === 200) {
            toast.success("Model Trained Successfully");
            resolve(train);
          } else {
            reject("Error");
          }
        }
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  };

  const getOwnedAssets = useCallback(async () => {
    try {
      setLoadingAsset(true);
      const getOwnedAssets = await assetService.getAssetByPublicKey(
        currentUser?.publicKey
      );

      if (getOwnedAssets.status === 200) {
        let dummyArr = [];
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
      setLoadingAsset(false);
    }
  }, []);

  useEffect(() => {
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
    <React.Fragment>
      <div className="my-6 bg-white rounded-lg shadow md:flex md:items-center md:justify-between md:p-6 xl:p-8 dark:bg-gray-800">
        <div className="flex flex-col space-y-4 mb-6 mt-2 w-full">
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold text-gray-900">
                Select and Train Datasets
              </h3>
              <Badge color="gray">
                <p className="text-sm font-medium text-gray-700">
                  Preprocessed
                </p>
              </Badge>
            </div>

            <p className="text-base font-normal mt-4 text-gray-500">
              Welcome to our state-of-the-art AutoML training platform! Our
              platform is designed to make machine learning accessible to
              everyone, regardless of their technical expertise or level of
              experience. With our intuitive interface, you can easily select
              and train your dataset using the latest AutoML technologies,
              without having to worry about the complexities of coding and
              algorithm selection.
            </p>
          </div>
          <div className="flex flex-col w-full mb-2">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Asset
            </label>
            <ReactMultiSelect
              data={assets}
              name="asset"
              isLoading={loadingAsset}
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
              isLoading={loadingAsset}
              name="asset"
              isDisabled={!selectedAsset}
              setSelected={setSelectedColumn}
              selected={selectedColumn}
            />
          </div>
          <div className="flex items-center justify-end w-full space-x-4 pt-12">
            <PrimaryButton
              disabled={loading}
              content="Train Dataset"
              status="Authenticating"
              loading={loading}
              onClick={() => setIsDecryptOpen(true)}
            />
          </div>
        </div>
      </div>
      <CredentialModal
        action="Train Dataset"
        setIsOpen={setIsDecryptOpen}
        authFunction={() => trainAsset(selectedAsset.value)}
        loading={loading}
        isOpen={isDecryptOpen}
        credInputs={keyPair}
        setCredentials={setCredentials}
      />
    </React.Fragment>
  );
};

export default TrainingForm;

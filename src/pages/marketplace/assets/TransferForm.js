import { Spinner } from "flowbite-react";
import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CustomDropZone from "../../../components/global/CustomDropZone";
import FormAlert from "../../../components/global/FormAlert";
import FormInput from "../../../components/ui/FormInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import { ENCRYPTION, STATE } from "../../../enum";
import useCredential from "../../../hooks/useCredentialHook";
import { clearError, setError } from "../../../redux/slices/error";
import { setMessage } from "../../../redux/slices/message";
import assetService from "../../../services/asset/assetService";
import chainService from "../../../services/web3/chainService";
import LoadingGif from "../../../static/images/block.gif";

const TransferForm = memo(({ loading, setLoading, setIsOpen, asset }) => {
  const { message } = useSelector((state) => state.message);
  let navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const dispatch = useDispatch();
  const [credFile, setCredFile] = useState(null);
  const { credentials, error } = useCredential(credFile);

  const transferAsset = async (data) => {
    if (!asset) return toast.error("Asset not found!!!");
    if (!credFile) return dispatch(setError("Please Upload Credentials File"));

    if (error) {
      setCredFile(null);
    }
    setLoading(true);
    let metaData = { ...data };
    metaData.assetTitle = metaData.assetTitle + "-" + uuidv4();
    metaData.assetAmount = asset?.assetAmount;
    delete metaData.file;

    try {
      const getAsset = await assetService.getAssetByID(asset?._id);

      if (getAsset.status === 200) {
        await chainService
          .transferAsset(
            getAsset?.data?.data?.assetData,
            credentials,
            metaData,
            dispatch
          )
          .then(async (data) => {
            const updateAsset = {
              txID: data.response.id,
              assetData: data.assetData,
              status: STATE.OWNED,
              ...metaData,
            };
            dispatch(setMessage("Updating asset!!!"));
            const assetResponse = await assetService.updateAsset(
              updateAsset,
              asset._id
            );
            if (assetResponse.status === 200) {
              setIsOpen(false);
              setLoading(false);
              toast.success("Asset Transfered Successfully!!!");
            }
          });
      }
    } catch (error) {
      console.log("ERROR", error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch(setError(message));
    } finally {
      setLoading(false);
      setCredFile(null);
      dispatch(clearError());
      reset();
      navigate("/assets");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center space-y-6 items-center h-full">
        <img className="w-96 h-96" src={LoadingGif} alt={message} />
        <h3 className="font-base text-md">{message}</h3>
        <Spinner size="lg" />
      </div>
    );
  } else
    return (
      <form onSubmit={handleSubmit(transferAsset)}>
        <div className="flex flex-col space-y-4 mb-16">
          <FormAlert color="failure" />
          <FormInput
            name="assetTitle"
            type="text"
            placeholder="Asset Title"
            required={true}
            label="Asset Title"
            setInput={register}
            disabled={loading}
          />

          <div className="flex flex-col w-full mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Asset Description
            </label>
            <textarea
              name="assetDescription"
              placeholder="Enter Asset description"
              required={true}
              type="text"
              {...register("assetDescription")}
              disabled={loading}
              label="Asset Description"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />
          </div>
          <CustomDropZone
            name="credFile"
            setFiles={setCredFile}
            label="Credential File"
            disabled={loading}
            file={credFile}
            drop={true}
            accept=""
          />
          <div className="bottom-0 left-0 flex justify-center w-full pb-10 space-x-4 px-8 fixed bg-gradient-to-b from-transparent to-white pt-12">
            <PrimaryButton
              disabled={loading}
              content="Transfer"
              status="Creating Transfer"
              fullSized
              loading={loading}
            />
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (!loading) {
                  setIsOpen((open) => !open);
                }
              }}
              className="inline-flex justify-center text-gray-500 items-center bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5 -ml-1 sm:mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              Cancel
            </button>
          </div>
        </div>
      </form>
    );
});

export default TransferForm;

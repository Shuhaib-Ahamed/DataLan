import { FileInput, Label } from "flowbite-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomDropZone from "../../../components/global/CustomDropZone";
import FormInput from "../../../components/ui/FormInput";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import useCredential from "../../../hooks/useCredentialHook";
// import chainService from "../../../web3/chainService";

const AssetForm = ({ loading, setLoading, setIsOpen }) => {
  let navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [credFile, setCredFile] = useState(null);
  const { credentials, error } = useCredential(credFile);

  const uploadAsset = async (data) => {
    setLoading(true);
    try {
      if (!credFile) return toast.warning("Please upload credential file");

      const metaData = { ...data, file: undefined };

      console.log(
        "Credentials",
        credentials,
        "MetaData",
        metaData,
        "File",
        data.file[0]
      );

      // await chainService
      //   .uploadAsset(data.file[0], metaData, credentials)
      //   .then((result) => {
      //     console.log("Stellar", result);
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(uploadAsset)}>
      <div className="flex flex-col space-y-4 mb-16">
        <FormInput
          name="assetTitle"
          type="text"
          placeholder="Asset Title"
          required={true}
          label="Asset Title"
          setInput={register}
          disabled={loading}
        />
        <FormInput
          name="assetAmount"
          placeholder="100 LUMENS"
          required={true}
          min="200"
          type="number"
          label="Asset Amount"
          setInput={register}
          disabled={loading}
        />

        <div className="flex flex-col w-full mb-4">
          <div className="mb-2 block">
            <Label htmlFor="file" value="Asset File" />
          </div>
          <FileInput
            className="block outline-0 w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            name="file"
            accept="text/csv"
            {...register("file")}
            required={true}
            disabled={loading}
            type="file"
          />
        </div>

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
            content="Add Asset"
            status="Adding Asset"
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
};

export default AssetForm;

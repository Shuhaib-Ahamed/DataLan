import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const CustomDropZone = ({ file, setFiles, accept, name, label, disabled }) => {
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles[0]?.name.split(".")[1] !== "nt")
      return toast.warning("Invalid file format");
    setFiles(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col w-full mb-4">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>

      <div
        className="flex items-center justify-center w-full "
        {...getRootProps()}
      >
        <div className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
          <div className="flex flex-col items-center justify-center p-4">
            {file ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {file?.name}
              </p>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or Drag &
                Drop
              </p>
            )}
          </div>
          <input
            name={name}
            accept={accept}
            disabled={disabled}
            {...getInputProps()}
            type="file"
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomDropZone;

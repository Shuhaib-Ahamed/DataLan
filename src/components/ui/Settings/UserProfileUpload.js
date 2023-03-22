import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import userService from "../../../services/user/userService.js";
import Loader from "../../../static/images/loading.gif";
import { getUser } from "../../../redux/slices/auth.js";
import { uploadFile, deleteFile } from "../../../utils/firebaseService.js";

const UserProfileUpload = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    try {
      if (acceptedFiles.length > 0) {
        const photoURL = await uploadFile(acceptedFiles[0]);
        const userData = await onUpload(photoURL);
        if (userData.succeeded) {
          dispatch(getUser());
          toast.success("Profile picture updated!");
        } else {
          toast.error("Error updating profile picture!");
        }
      } else {
        toast.warning("Please select a different file!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
    maxSize: 943718,
  });

  const onDelete = async () => {
    setLoading(true);
    try {
      deleteFile(currentUser?.data?.userData?.photoURL);
      const newUserData = {
        ...currentUser?.data?.userData,
      };
      delete newUserData.photoURL;

      const savedUser = await userService.updateUser({
        data: { userData: newUserData },
      });
      if (savedUser.data.succeeded) {
        dispatch(getUser());
      } else {
        toast.error("Error updating profile picture!");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onUpload = async (photoURL) => {
    const newUserData = {
      ...currentUser?.data?.userData,
      photoURL: photoURL,
    };
    const savedUser = await userService.updateUser({
      data: { userData: newUserData },
    });
    return savedUser.data;
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center flex space-x-4">
        <img
          className="rounded-lg w-28 h-28"
          src={
            loading
              ? Loader
              : currentUser?.data?.userData?.photoURL ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNL_ZnOTpXSvhf1UaK7beHey2BX42U6solRA&usqp=CAU"
          }
          alt={currentUser?.userName}
        />
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Profile picture
          </h3>
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            JPG, GIF or PNG. Max size of 800K
          </div>
          <div className="flex items-center space-x-4">
            <div
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              {...getRootProps()}
            >
              <input accept="image/*" {...getInputProps()} />
              <svg
                className="w-4 h-4 mr-2 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
              </svg>
              Upload picture
            </div>

            <button
              onClick={() => onDelete()}
              disabled={loading}
              type="button"
              className="py-2 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileUpload;

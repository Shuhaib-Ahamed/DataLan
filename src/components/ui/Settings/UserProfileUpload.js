import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import userService from "../../../services/user/userService.js";
import storage from "../../../firebaseConfig.js";
import { getUser } from "../../../redux/slices/auth.js";

const UserProfileUpload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    setLoading(true);
    try {
      if (acceptedFiles.length > 0) {
        await fireBaseUpload(acceptedFiles[0]);
      } else {
        toast.error("Please add an image!!!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const fireBaseUpload = async (file) => {
    const storageRef = ref(storage, `/profiles/${file?.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (photoURL) => {
          const newUserData = {
            ...currentUser?.data?.userData,
            photoURL: photoURL,
          };
          const savedUser = await userService.updateUser({
            data: { userData: newUserData },
          });
          if (savedUser.data?.succeeded) {
            dispatch(getUser());
          }
        });
      }
    );
  };

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <div className="items-center flex space-x-4">
        <img
          className="rounded-lg w-28 h-28"
          src={
            currentUser?.data?.userData?.photoURL ||
            "https://i.pinimg.com/originals/ae/ec/c2/aeecc22a67dac7987a80ac0724658493.jpg"
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

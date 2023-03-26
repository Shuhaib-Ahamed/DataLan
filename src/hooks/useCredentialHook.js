import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setError } from "../redux/slices/error";
import fileService from "../utils/file";

const useCredential = (file) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!file) return;
    fileService
      .readFromFile(file)
      .then((keys) => {
        if (keys?.publicKey === currentUser?.publicKey) {
          setCredentials(keys);
        } else {
          setError(true);
          return toast.error("Invalid credential file");
        }
      })
      .catch((error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch(setError(message));
      });
  }, [file]);
  return { credentials, error };
};
export default useCredential;

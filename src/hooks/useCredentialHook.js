import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setError } from "../redux/slices/error";
import fileService from "../utils/file";

const useCredential = (file) => {
  const [credentials, setCredentials] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!file) return;

    fileService
      .readFromFile(file)
      .then((keys) => {
        setCredentials(keys);
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
  return { credentials };
};
export default useCredential;

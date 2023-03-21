import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import fileService from "../utils/file";

const useCredential = (file) => {
  const [credentials, setCredentials] = useState(null);
  useEffect(() => {
    if (!file) return;

    fileService
      .readFromFile(file)
      .then((keys) => {
        setCredentials(keys);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error reading file");
      });
  }, [file]);
  return { credentials };
};
export default useCredential;

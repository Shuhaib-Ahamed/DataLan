import { useEffect, useState } from "react";
import authHeader from "../services/auth/auth-header";

const useFetch = (url) => {
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  useEffect(() => {
    try {
      if (localStorage.user && localStorage.token) {
        fetch(url, {
          headers: authHeader(),
        })
          .then((res) => res.json())
          .then((data) => {
            setdata(data.data);
          });
      }
    } catch (error) {
      console.log(error);
      seterror(true);
    } finally {
      setloading(false);
    }
  }, [url]);
  return { data, loading, error };
};
export default useFetch;

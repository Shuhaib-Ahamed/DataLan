import { useEffect, useState } from "react";
import authHeader from "../services/auth/auth-header";

const useFetch = (url) => {
  const [data, setdata] = useState(null);
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState("");
  useEffect(() => {
    fetch(url, {
      headers: authHeader(),
    })
      .then((res) => res.json())
      .then((data) => {
        seterror(data.error);
        setdata(data.data);
        setloading(false);
      });
  }, [url]);
  return { data, loading, error };
};
export default useFetch;

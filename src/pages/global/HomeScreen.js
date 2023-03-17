import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import Nav from "../../components/global/Nav";
import useFetch from "../../hooks/useFetch";
import { logout } from "../../redux/slices/auth";
import Credentails from "../../static/pages/Credentails";
import Error from "../../static/pages/Error";
import LoadingScreen from "../../static/pages/LoadingScreen";

const BACKEND_URL = "http://localhost:9000/api/v1/";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const [showCredentials, setShowCredentials] = useState(false);
  const { data, loading, error } = useFetch(
    BACKEND_URL + "user/" + currentUser?._id
  );
  const navigate = useNavigate();

  if (!currentUser) {
    navigate("/login");
  }

  useEffect(() => {
    if (data) {
      if (data?.isVerified) {
        setShowCredentials(false);
      } else setShowCredentials(true);
      localStorage.setItem("user", JSON.stringify(data));
    }
  }, [data]);

  if (error) {
    return <Error />;
  } else
    return (
      <div className="relative w-full max-w-screen-2xl mx-auto h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <Nav />
            <Credentails
              show={showCredentials}
              popup={false}
              content={{
                publicKey: data?.publicKey,
                privateKey: message,
              }}
              setShowCredentials={setShowCredentials}
            />
          </>
        )}
      </div>
    );
};

export default HomeScreen;

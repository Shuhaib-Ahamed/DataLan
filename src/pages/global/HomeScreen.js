import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Banner from "../../components/ui/Banner";
import useFetch from "../../hooks/useFetch";
import DashboardLayout from "../../layouts/DashboardLayout";
import Credentails from "../../static/pages/Credentails";
import NotFoundScreen from "../../static/pages/NotFoundScreen";
import LoadingScreen from "../../static/pages/LoadingScreen";
import { dev } from "../../config";

const HomeScreen = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const [showCredentials, setShowCredentials] = useState(false);
  const { data, loading, error } = useFetch(
    dev.backendURL + "user/" + currentUser?._id
  );

  useEffect(() => {
    if (data) {
      if (data?.isVerified) {
        setShowCredentials(false);
      } else setShowCredentials(true);
      localStorage.setItem("user", JSON.stringify(data));
    }
  }, [data]);

  if (error) {
    return <NotFoundScreen />;
  } else
    return (
      <React.Fragment>
        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <DashboardLayout>
              <Banner /> <div className="py-96">sda</div>
            </DashboardLayout>
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
      </React.Fragment>
    );
};

export default HomeScreen;

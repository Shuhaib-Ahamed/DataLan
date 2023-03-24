import React, { useEffect, useState } from "react";
import Banner from "../../components/ui/Banner";
import DashboardLayout from "../../layouts/DashboardLayout";
import Marketplace from "../marketplace/Marketplace";
import Credentials from "../../static/pages/Credentails";
import { useSelector } from "react-redux";

const HomeScreen = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    if (currentUser?.isVerified) {
      setShowCredentials(false);
    } else {
      setShowCredentials(true);
    }
  }, [currentUser]);

  return (
    <React.Fragment>
      <DashboardLayout>
        <Banner /> <Marketplace />
      </DashboardLayout>
      <Credentials
        show={showCredentials}
        popup={false}
        content={{
          publicKey: currentUser?.publicKey,
          privateKey: message,
        }}
        setShowCredentials={setShowCredentials}
      />
    </React.Fragment>
  );
};

export default HomeScreen;

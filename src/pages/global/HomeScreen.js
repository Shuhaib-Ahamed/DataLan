import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import Nav from "../../components/global/Nav";
import userService from "../../services/chain/userService";

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  console.log(currentUser);
  // useEffect(() => {

  // }, [currentUser]);

  return (
    <div
      id="main-content"
      class="relative w-full max-w-screen-2xl mx-auto h-full overflow-y-auto bg-gray-50 dark:bg-gray-900"
    >
      <Nav />
    </div>
  );
};

export default HomeScreen;

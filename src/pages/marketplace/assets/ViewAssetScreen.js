import {
  Badge,
  Breadcrumb,
  Label,
  Spinner,
  TextInput,
  Tooltip,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import { HiClock } from "react-icons/hi";
import { SiHiveBlockchain } from "react-icons/si";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { ROLE, STATE } from "../../../enum";
import Drawer from "../../../components/global/Drawer";
import { toast } from "react-toastify";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import requestService from "../../../services/request/requestService";
import assetService from "../../../services/asset/assetService";
import TransferForm from "./TransferForm";
import { dev } from "../../../config";

const ViewAssetScreen = () => {
  let { state } = useLocation();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [assetLoading, setAssetLoading] = useState(false);
  const [asset, setAsset] = useState(false);

  const handleTransferOrRequest = async (asset) => {
    if (!currentUser?.data?.userData) {
      return toast.warning("Please add your user details first");
    }
    if (!loading) {
      if (
        currentUser?.publicKey === state?.asset?.publicKey ||
        currentUser?.publicKey === asset?.publicKey
      ) {
        setIsOpen((open) => !open);
      } else if (
        currentUser?.publicKey !== state?.asset?.publicKey ||
        currentUser?.publicKey !==
          (asset?.publicKey && currentUser?.role === ROLE.BUYER)
      ) {
        try {
          setLoading(true);
          if (!asset) return toast.warning("Asset not found!!");

          const response = await requestService.sendAssetRequest({
            assetId: asset?._id,
            toPublicKey: asset?.publicKey,
            fromPublicKey: currentUser?.publicKey,
            userData: {
              ...currentUser?.data?.userData,
              email: currentUser?.email,
            },
          });

          if (response?.status === 201) {
            return toast.success("Asset request sent successfully");
          }
        } catch (error) {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          toast.error(message);
        } finally {
          setLoading(false);
        }
      } else toast.warning("Please change your user role");
    }
  };

  const fetchAssetWithOriginalID = async (id, userPublicKey) => {
    setAssetLoading(true);
    try {
      const res = await assetService.getAssetByOriginalId(id, {
        userPublicKey: userPublicKey,
      });

      if (res?.status === 200) {
        return setAsset(res?.data?.data[0]);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setAssetLoading(false);
    }
  };

  const fetchAsset = async (id) => {
    setAssetLoading(true);
    try {
      const res = await assetService.getAsset(id);
      if (res?.status === 200) {
        return setAsset(res?.data?.data);
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    } finally {
      setAssetLoading(false);
    }
  };

  useEffect(() => {
    if (state?.userPublicKey) {
      fetchAssetWithOriginalID(state?.assetId, state?.userPublicKey);
    } else if (!state) {
      fetchAsset(id);
    }
    window.scrollTo(0, 0);
  }, [state]);

  return (
    <DashboardLayout>
      <div className="mb-4 py-4 px-10 flex flex-col ">
        <Breadcrumb>
          <Breadcrumb.Item icon={AiFillHome}>
            <NavLink to="/">Home</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <NavLink to="/assets">Assets</NavLink>
          </Breadcrumb.Item>
          <Breadcrumb.Item># {state?.asset?._id || asset?._id}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="text-3xl my-4 font-semibold text-gray-900">
          View Asset
        </h1>

        {assetLoading ? (
          <React.Fragment>
            <div className="flex flex-col justify-center items-center pt-16 pb-6 mx-auto dark:bg-gray-900">
              <div className="text-center">
                <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                  Loading!!
                </h1>
                <p className="text-base font-base text-gray-500 flex flex-col gap-4 items-center justify-center dark:text-gray-400">
                  Please wait while we fetch the asset details{" "}
                  <Spinner size="lg" />
                </p>
              </div>
              <div className="block max-w-sm">
                <img
                  src="https://flowbite-admin-dashboard.vercel.app/images/illustrations/500.svg"
                  alt="astronaut image"
                />
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className=" bg-white mt-2 rounded-lg shadow dark:bg-gray-800">
            <div className="relative rounded-lg overflow-hidden">
              <div
                className=" bg-cover bg-blend-overlay bg-center h-auto w-full text-white py-16 px-10 object-fill bg-gray-800"
                style={{
                  backgroundImage: `url(https://source.unsplash.com/random/?${
                    state?.asset?.assetTitle?.split(" ")[0] ||
                    asset?.assetTitle?.split(" ")[0]
                  })`,
                }}
              >
                <h1 className="text-4xl font-extrabold text-white">
                  {state?.asset?.assetTitle?.split("-")[0] ||
                    asset?.assetTitle?.split("-")[0]}
                </h1>{" "}
              </div>
            </div>

            <div className="flex flex-col p-10 gap-4 mb-4">
              <div className="mb-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold text-gray-900">
                    About
                  </h3>
                  <Badge color="gray" icon={HiClock}>
                    <p className="text-sm font-medium text-gray-700">
                      {moment(state?.asset?.createdAt || asset?.createdAt)
                        .startOf("day")
                        .fromNow()}
                    </p>
                  </Badge>
                </div>

                <p className="text-base font-normal mt-4 text-gray-500">
                  {state?.asset?.assetDescription || asset?.assetDescription}
                </p>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="publicKey" value="Owner Public Key" />
                </div>

                <TextInput
                  id="publicKey"
                  name="publicKey"
                  defaultValue={state?.asset?.publicKey || asset?.publicKey}
                  readOnly
                  addon={
                    <p className="text-xs font-semibold text-gray-700">
                      {state?.asset?.status || asset?.status}
                    </p>
                  }
                />
              </div>{" "}
              <div>
                <div className="mb-2 block cursor-pointer">
                  <Label htmlFor="txId" value="Stellar Transaction ID" />
                </div>

                <a
                  target="_blank"
                  href={
                    dev.setllarURL + "/transactions/" + state?.asset?.txID ||
                    asset?.txID
                  }
                >
                  <TextInput
                    className="w-100 "
                    id="txID"
                    name="txID"
                    defaultValue={state?.asset?.txID || asset?.txID}
                    readOnly
                    addon={
                      <p className="text-xs font-semibold text-gray-700 flex items-center">
                        TXID
                      </p>
                    }
                  />
                </a>
              </div>
              <div>
                <div className="mb-2 block cursor-pointer">
                  <Label htmlFor="publicKey" value="Asset Amount" />
                </div>

                <TextInput
                  id="publicKey"
                  name="publicKey"
                  defaultValue={state?.asset?.assetAmount || asset?.assetAmount}
                  readOnly
                  addon={
                    <p className="text-xs font-semibold text-gray-700 flex items-center">
                      LUMENS
                    </p>
                  }
                />
              </div>
              {state?.asset?.originalId ? (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="originalAssetId" value="Dataset Origin" />
                  </div>{" "}
                  <TextInput
                    onClick={() =>
                      navigate(`/assets/${state?.asset?.originalId}`)
                    }
                    name="originalAssetId"
                    id="originalAssetId"
                    defaultValue={state?.asset?.originalId}
                    readOnly
                    addon={
                      <p className="text-xs font-semibold text-gray-700 flex items-center">
                        #
                      </p>
                    }
                  />{" "}
                </div>
              ) : asset?.originalId ? (
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="originalAssetId" value="Dataset Origin" />
                  </div>
                  <TextInput
                    onClick={() => navigate(`/assets/${asset?.originalId}`)}
                    name="originalAssetId"
                    id="originalAssetId"
                    defaultValue={asset?.originalId}
                    readOnly
                    addon={
                      <p className="text-xs font-semibold text-gray-700 flex items-center">
                        #
                      </p>
                    }
                  />{" "}
                </div>
              ) : (
                <></>
              )}
              <div className="flex items-center justify-end space-x-4 mt-10">
                <button className=" inline-flex items-center py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                  <SiHiveBlockchain className="w-4 h-4 mr-2" /> View on
                  Blockchain
                </button>
                {currentUser?.publicKey === state?.asset?.publicKey ||
                  (currentUser?.publicKey === asset?.publicKey &&
                  asset.status === STATE.TRANSFERED ? (
                    <PrimaryButton
                      disabled={loading}
                      onClick={() =>
                        handleTransferOrRequest(state?.asset || asset)
                      }
                      content={"Transfer Asset"}
                      status="Sending Request"
                      loading={loading}
                    />
                  ) : (
                    <PrimaryButton
                      disabled={loading}
                      onClick={() =>
                        handleTransferOrRequest(state?.asset || asset)
                      }
                      content={"Request Asset"}
                      status="Sending Request"
                      loading={loading}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        <Drawer
          header="Transfer Asset"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={loading}
        >
          <TransferForm
            setLoading={setLoading}
            loading={loading}
            setIsOpen={setIsOpen}
            asset={state?.asset || asset}
          />
        </Drawer>
      </div>
    </DashboardLayout>
  );
};

export default ViewAssetScreen;

// <Alert
// color="info"
// additionalContent={
//   <React.Fragment>
//     <div className="text-sm text-blue-700 dark:text-blue-800">
//       Looking to transfer an asset? Try switching your user role?
//     </div>
//   </React.Fragment>
// }
// icon={HiInformationCircle}
// >
// <h3 className="text-lg font-medium text-blue-700 dark:text-blue-800">
//   Switch User Role
// </h3>
// </Alert>

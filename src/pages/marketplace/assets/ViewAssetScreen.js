import { Badge, Breadcrumb, Label, TextInput } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import DashboardLayout from "../../../layouts/DashboardLayout";
// Icons
import { AiFillHome } from "react-icons/ai";
import { HiClock } from "react-icons/hi";
import { SiHiveBlockchain } from "react-icons/si";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { ROLE } from "../../../enum";
import Drawer from "../../../components/global/Drawer";
import { toast } from "react-toastify";
import PrimaryButton from "../../../components/ui/PrimaryButton";
import assetService from "../../../services/asset/assetService";

const ViewAssetScreen = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  let { state } = useLocation();

  const handleTransferOrRequest = async (asset) => {
    if (!loading) {
      if (
        currentUser?.publicKey === state?.asset?.publicKey &&
        currentUser?.role === ROLE.PROVIDER
      ) {
        setIsOpen((open) => !open);
      } else if (
        currentUser?.publicKey !== state?.asset?.publicKey &&
        currentUser?.role === ROLE.BUYER
      ) {
        try {
          setLoading(true);
          if (!asset) return toast.warning("Asset not found!!");

          const response = await assetService.sendAssetRequest({
            assetId: asset?._id,
            toPublicKey: asset?.publicKey,
            fromPublicKey: currentUser?.publicKey,
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
          <Breadcrumb.Item># {state?.asset?._id}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="text-3xl my-4 font-semibold text-gray-900">
          View Asset
        </h1>

        <div className=" bg-white mt-2 rounded-lg shadow dark:bg-gray-800">
          <div className="relative rounded-lg overflow-hidden">
            <div
              className=" bg-cover bg-blend-overlay bg-center h-auto w-full text-white py-16 px-10 object-fill bg-gray-800"
              style={{
                backgroundImage: `url(https://source.unsplash.com/random/?${
                  state?.asset?.assetTitle?.split(" ")[0]
                })`,
              }}
            >
              <h1 className="text-4xl font-extrabold text-white">
                {state?.asset?.assetTitle.split("-")[0]}
              </h1>{" "}
            </div>
          </div>

          <div className="flex flex-col p-10 gap-4 mb-4">
            <div className="mb-2">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold text-gray-900">About</h3>
                <Badge color="gray" icon={HiClock}>
                  <p className="text-sm font-medium text-gray-700">
                    {moment(state?.asset?.createdAt).startOf("day").fromNow()}
                  </p>
                </Badge>
              </div>

              <p className="text-base font-normal mt-4 text-gray-500">
                {state?.asset?.assetDescription}
              </p>
            </div>

            <div>
              <div className="mb-2 block">
                <Label htmlFor="publicKey" value="Stellar Public Key" />
              </div>
              <TextInput
                id="publicKey"
                defaultValue={state?.asset?.publicKey}
                readOnly
                required={true}
                addon={
                  <p className="text-xs font-semibold text-gray-700">
                    {state?.asset?.status}
                  </p>
                }
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="publicKey" value="Asset Amount" />
              </div>
              <TextInput
                id="publicKey"
                defaultValue={state?.asset?.assetAmount}
                readOnly
                required={true}
                addon={
                  <p className="text-xs font-semibold text-gray-700 flex items-center">
                    LUMENS
                  </p>
                }
              />
            </div>

            <div className="flex items-center justify-end space-x-4 mt-10">
              <button className=" inline-flex items-center py-2.5 px-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <SiHiveBlockchain className="w-4 h-4 mr-2" /> View on Blockchain
              </button>
              <PrimaryButton
                disabled={loading}
                onClick={() => handleTransferOrRequest(state?.asset)}
                content={
                  currentUser?.publicKey === state?.asset?.publicKey
                    ? "Transfer Asset"
                    : "Request Asset"
                }
                status="Sending Request"
                loading={loading}
              />
            </div>
          </div>
        </div>
        <Drawer
          header="Transfer Asset"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          loading={loading}
        ></Drawer>
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

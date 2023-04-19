import { Avatar, Badge, Spinner } from "flowbite-react";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CredentialModal from "../../../components/global/CredentialModal";
import { ACTIONS, ENCRYPTION, REQUEST_STATUS, ROLE } from "../../../enum";
import assetService from "../../../services/asset/assetService";
import requestService from "../../../services/request/requestService";
import chainService from "../../../services/web3/chainService";
import encryptor from "../../../utils/encryptor";
import RequestHeader from "./RequestHeader";
import { setMessage } from "../../../redux/slices/message";

import StellarSdk from "stellar-sdk";
import { dev } from "../../../config";

const setllarConnection = new StellarSdk.Server(dev.setllarURL);

const RequestsTable = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [type, setType] = useState(() =>
    currentUser?.role === ROLE.BUYER ? 1 : 0
  );
  const [requests, setRequests] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState({
    request: null,
    action: "",
  });
  const dispatch = useDispatch();
  const [keyPair, setCredentials] = useState({
    publicKey: "",
    privateKey: "",
  });

  const acceptRequest = async () => {
    let decryptedAssetData = null;
    setTransferLoading(true);
    try {
      dispatch(setMessage("Decrypting asset data..."));
      if (!currentRequest.request) return;

      await validateRequest(
        currentRequest.request?._id,
        currentRequest.request?.assetId
      )
        .then(async (asset) => {
          if (asset?.encryptionType === ENCRYPTION.AES) {
            // decrypt assetData from MongoDB
            decryptedAssetData = encryptor.symmetricDecryption(
              asset?.assetData,
              keyPair?.privateKey
            );
          } else if (asset?.encryptionType === ENCRYPTION.RSA) {
            // decrypt assetData from MongoDB
            decryptedAssetData = encryptor.asymmetricDecryption(
              JSON.parse(asset?.assetData),
              keyPair?.privateKey
            );
          } else {
            throw new Error("Could not decrypt asset data");
          }

          const initiateTransfer = await chainService.initiateTransferAsset(
            currentRequest.request?._id,
            currentRequest.request?.assetId,
            decryptedAssetData,
            keyPair,
            currentRequest.request?.fromPublicKey,
            dispatch,
            asset?.encryptionType,
            setllarConnection
          );

          if (initiateTransfer?.status === 204) {
            navigate("/requests");
            return toast.success("Asset transfer initiated successfully");
          }
        })
        .catch((error) => toast.error(error.message));
    } catch (error) {
      console.log(error);
    } finally {
      setTransferLoading(false);
      setIsOpen(false);
      setType((prev) => (prev === 0 ? 1 : 0));
     
    }
  };

  const validateRequest = (requestId, assetId) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Checking if request is valid
        const requestCheck = await requestService.getRequestByID(requestId);
        if (requestCheck.status !== 200) {
          throw new Error("Request not found");
        }

        // Checking if request is status
        if (
          requestCheck.data.data.status === REQUEST_STATUS.GRANTED ||
          requestCheck.data.data.status === REQUEST_STATUS.TRANSFERD
        ) {
          throw new Error("Request already granted or transfered");
        }

        // Checking if asset is valid
        const assetCheck = await assetService.getAssetByID(assetId);
        if (assetCheck.status !== 200) {
          throw new Error("Asset not found");
        }

        resolve(assetCheck?.data?.data); // If all checks passed, resolve with true
      } catch (error) {
        reject(error); // If any checks failed, reject with the error message
      }
    });
  };

  const toggleModal = (request, action) => {
    if (action === ACTIONS.TRANSFER)
      return navigate(`/assets/${request?.assetId}`, {
        state: {
          assetId: request?.assetId,
          userPublicKey: request?.fromPublicKey,
        },
      });
    setIsOpen(!isOpen);
    setCurrentRequest({ request: request, action: action });
  };

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        if (type === 0) {
          const res = await requestService.getIncomingRequests(
            currentUser?.publicKey
          );
          if (res.status === 200) {
            setRequests(res.data.data);
          }
        } else if (type === 1) {
          const res = await requestService.getSentRequests(
            currentUser?.publicKey
          );
          if (res.status === 200) {
            setRequests(res.data.data);
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [type, currentUser?.publicKey]);

  return (
    <div className=" bg-white  block ">
      <div className="flex flex-col">
        <div className="overflow-x-auto rounded-lg shadow">
          <RequestHeader setType={setType} type={type} />
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <table className="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
                {loading ? (
                  <React.Fragment>
                    <tbody>
                      <tr className="p-4 flex  items-center justify-center">
                        <td>
                          <Spinner size="lg" />
                        </td>
                      </tr>
                    </tbody>
                  </React.Fragment>
                ) : requests?.length === 0 ? (
                  <React.Fragment>
                    <div className="flex flex-col justify-center items-center pt-16 pb-6 mx-auto dark:bg-gray-900">
                      <div className="text-center">
                        <h1 className="mb-3 text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                          No Requests Found!!
                        </h1>
                        <p className="text-base font-base text-gray-500  dark:text-gray-400">
                          A buyer needs to send an asset request to you to view
                          it here.
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
                  <React.Fragment>
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr colSpan="4">
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          {type === 0 ? "Sent To" : "Sent By"}
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Status
                        </th>

                        <th
                          scope="col"
                          className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {requests?.length > 0 &&
                        requests.map((request, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <td className="flex items-center p-4 space-x-6 whitespace-nowrap">
                              <Avatar
                                className="bg-gray-800 rounded-full"
                                img={
                                  request?.userData?.photoURL ??
                                  `https://robohash.org/${currentUser?.username}.png?set=set1`
                                }
                                rounded={true}
                              />
                              <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                <div className="text-base font-semibold text-gray-900 dark:text-white">
                                  {request?.userData?.firstName +
                                    " " +
                                    request?.userData?.lastName}
                                </div>
                                <div className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                  {request?.userData.email}
                                </div>
                              </div>
                            </td>

                            <td className="p-4 max-w-xs overflow-hidden text-base font-normal text-gray-500 truncate dark:text-gray-400">
                              {type === 0
                                ? request?.toPublicKey
                                : request?.fromPublicKey}
                            </td>

                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {moment(request?.createdAt).fromNow()}
                            </td>
                            <td className="p-4 text-base font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              <Badge
                                className="flex justify-center"
                                color={
                                  request.status === REQUEST_STATUS.INREVIEW
                                    ? "warning"
                                    : request.status === REQUEST_STATUS.GRANTED
                                    ? "indigo"
                                    : "success"
                                }
                              >
                                {request?.status}
                              </Badge>
                            </td>
                            <td className="p-4  space-x-4 whitespace-nowrap">
                              {type === 1 ? (
                                <React.Fragment>
                                  {request?.status ===
                                  REQUEST_STATUS.INREVIEW ? (
                                    <button
                                      onClick={() =>
                                        toggleModal(request, ACTIONS.DELETE)
                                      }
                                      type="button"
                                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                    >
                                      <AiFillDelete className="mr-2" />
                                      Delete
                                    </button>
                                  ) : (
                                    <React.Fragment>
                                      {currentUser?.role !== ROLE.PROVIDER &&
                                        request?.status ===
                                          REQUEST_STATUS.INREVIEW && (
                                          <button
                                            type="button"
                                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                            onClick={() =>
                                              toggleModal(
                                                request,
                                                ACTIONS.TRANSFER
                                              )
                                            }
                                          >
                                            <AiFillDelete className="mr-2" />
                                            View
                                          </button>
                                        )}
                                    </React.Fragment>
                                  )}
                                </React.Fragment>
                              ) : (
                                <React.Fragment>
                                  {request?.status ===
                                    REQUEST_STATUS.INREVIEW && (
                                    <button
                                      type="button"
                                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                      onClick={() =>
                                        toggleModal(request, ACTIONS.ACCEPT)
                                      }
                                    >
                                      <AiFillDelete className="mr-2" />
                                      Accept
                                    </button>
                                  )}
                                </React.Fragment>
                              )}
                            </td>
                            <CredentialModal
                              action="Grant Transfer Access"
                              setIsOpen={setIsOpen}
                              authFunction={() => acceptRequest()}
                              loading={transferLoading}
                              isOpen={isOpen}
                              credInputs={keyPair}
                              setCredentials={setCredentials}
                            />
                          </tr>
                        ))}
                    </tbody>
                  </React.Fragment>
                )}
              </table>{" "}
              <div className="sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center mb-4 sm:mb-0">
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {Math.ceil(requests?.length / 2) +
                        " - " +
                        requests?.length}{" "}
                    </span>
                    of{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {requests?.length}
                    </span>
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    <svg
                      className="w-5 h-5 mr-1 -ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>{" "}
                    Previous
                  </button>
                  <button className="inline-flex w-24 items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                    Next{" "}
                    <svg
                      className="w-5 h-5 ml-1 -mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;

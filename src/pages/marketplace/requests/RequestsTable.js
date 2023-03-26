import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import requestService from "../../../services/request/requestService";
import { Avatar, Badge, Spinner } from "flowbite-react";
import { AiFillDelete } from "react-icons/ai";

import moment from "moment/moment";
import { REQUEST_STATUS } from "../../../enum";

const RequestsTable = ({ type }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState(null);

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
                          {type === 0 ? "Sent By" : "Sent To"}
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
                                img={request?.userData?.photoURL}
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
                                  REQUEST_STATUS.INREVIEW
                                    ? "warning"
                                    : REQUEST_STATUS.GRANTED
                                    ? "success"
                                    : "failure"
                                }
                              >
                                {request?.status}
                              </Badge>
                            </td>
                            <td className="p-4  space-x-4 whitespace-nowrap">
                              {type === 1 ? (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
                                >
                                  <AiFillDelete className="mr-2" />
                                  Delete
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                  <AiFillDelete className="mr-2" />
                                  Accept
                                </button>
                              )}
                            </td>
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
                      class="w-5 h-5 mr-1 -ml-1"
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
                      class="w-5 h-5 ml-1 -mr-1"
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

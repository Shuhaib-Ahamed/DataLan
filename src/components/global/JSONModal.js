import React, { Fragment, useEffect } from "react";
import JSONPretty from "react-json-pretty";
import { useDispatch } from "react-redux";
import { closeJSONModal } from "../../redux/slices/modal";
import { Spinner } from "flowbite-react";
import { useSelector } from "react-redux";
import LogoImage from "../../static/images/logo.svg";
import PrimaryButton from "../ui/PrimaryButton";
import LoadingGif from "../../static/images/block.gif";
import { dev } from "../../config";

export default function JSONModal() {
  const { data, loading, isOpen } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  const toggleModal = () => {
    if (!loading) {
      dispatch(closeJSONModal());
    }
  };

  return (
    <Fragment>
      <div
        className={`fixed overflow-hidden z-50 bg-gray-900 bg-opacity-60 inset-0 w-screen h-full ${
          !isOpen && "hidden"
        }`}
      >
        <div className="w-full h-full flex justify-center items-center">
          {loading ? (
            <div className="w-screen max-w-3xl relative bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col">
              <div className="flex justify-between items-center border-b  py-4 px-8 border-gray-200">
                <div className="flex items-center">
                  <img
                    src={LogoImage}
                    className="mr-2 h-6"
                    alt="Datalan-Logo"
                  />
                  <span className="self-center hidden sm:flex text-xl font-medium text-gray-900 dark:text-white">
                    Stellar Net View
                  </span>
                </div>
              </div>
              <div className="flex flex-col pt-10 pb-16 justify-center space-y-6 items-center h-full">
                <img className="w-72 h-72" src={LoadingGif} alt="loading" />
                <h3 className="font-base text-md">
                  Loading Stellar Network Data
                </h3>
                <Spinner size="lg" />
              </div>
            </div>
          ) : (
            <div className="w-screen max-w-3xl relative bg-white rounded-lg shadow dark:bg-gray-700 flex flex-col">
              <div className="flex justify-between items-center border-b  py-4 px-8 border-gray-200">
                <div className="flex items-center">
                  <img
                    src={LogoImage}
                    className="mr-2 h-6"
                    alt="Datalan-Logo"
                  />
                  <span className="self-center hidden sm:flex text-xl font-medium text-gray-900 dark:text-white">
                    Transaction Data
                  </span>
                </div>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => toggleModal()}
                  className=" text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
              </div>
              <div className="flex flex-col space-y-4 px-8 pt-4 pb-6 max-h-96 overflow-auto">
                <JSONPretty
                  style={{ fontSize: ".8em" }}
                  data={data}
                ></JSONPretty>
              </div>
              <div className="flex justify-center items-center py-6 px-8 space-x-6 border-t border-gray-200 rounded-b dark:border-gray-600">
                <a
                  href={dev.setllarURL + "/transactions/" + data?.id}
                  target="_blank"
                  className="w-full"
                >
                  <PrimaryButton
                    type="button"
                    fullSized
                    loading={loading}
                    content="View on Chain"
                    status="Loading"
                  />
                </a>

                <button
                  onClick={() => toggleModal()}
                  type="button"
                  disabled={loading}
                  className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
}

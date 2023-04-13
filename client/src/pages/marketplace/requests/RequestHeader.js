import React from "react";

const RequestHeader = ({ setType, type }) => {
  return (
    <div className="items-center justify-between block sm:flex md:divide-x md:divide-gray-100 dark:divide-gray-700">
      <ul
        className="hidden text-sm w-full font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg sm:flex dark:divide-gray-600 dark:text-gray-400"
        role="tablist"
      >
        <li className="w-full">
          <button
            type="button"
            onClick={() => setType(0)}
            className={
              "inline-block w-full p-4 rounded-tl-lg bg-gray-50 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600" +
              (type === 0 && "font-medium text-primary-600 ")
            }
          >
            Recieved
          </button>
        </li>
        <li className="w-full">
          <button
            onClick={() => setType(1)}
            type="button"
            className={
              "inline-block w-full  p-4 rounded-tr-lg bg-gray-50 hover:bg-gray-200 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600" +
              (type === 1 && "font-medium text-primary-600")
            }
          >
            Sent
          </button>
        </li>
      </ul>
    </div>
  );
};

export default RequestHeader;

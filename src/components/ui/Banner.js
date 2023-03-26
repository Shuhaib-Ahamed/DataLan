import React from "react";

const Banner = ({ highLight, title, content }) => {
  return (
    <div className="my-6 relative rounded-lg overflow-hidden">
      <div className=" bg-cover bg-center h-auto w-full text-white py-10 px-10 object-fill bg-gray-800">
        <h1 className="mb-2 text-4xl font-extrabold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-400 from-blue-500">
            {highLight}
          </span>{" "}
          {title}
        </h1>
        <p className="text-base font-light text-gray-400">{content}</p>
      </div>
    </div>
  );
};

export default Banner;

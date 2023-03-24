import React from "react";

const Banner = () => {
  return (
    <div className="my-6 relative mx-10 rounded-lg overflow-hidden">
      <div className=" bg-cover bg-center h-auto w-full text-white py-16 px-10 object-fill bg-gray-800">
        <h1 className="mb-4 text-4xl font-extrabold text-white">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-400 from-blue-500">
            Better Data
          </span>{" "}
          Scalable AI.
        </h1>
        <p className="text-base font-light text-gray-400">
          Here at AutoCS we focus on markets where technology, innovation, and
          capital can unlock long-term value and drive economic growth.
        </p>
      </div>
    </div>
  );
};

export default Banner;

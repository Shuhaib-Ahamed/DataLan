import React from "react";

const Banner = () => {
  return (
    <div className="relative bg-cover bg-center mt-16 h-auto text-white py-16 px-10  object-fill bg-gray-800">
      <h1 class="mb-4 text-4xl font-extrabold text-white">
        <span class="text-transparent bg-clip-text bg-gradient-to-r to-sky-400 from-blue-500">
          Better Data
        </span>{" "}
        Scalable AI.
      </h1>
      <p class="text-sm font-light lg:text-sm text-gray-400">
        Here at AutoCS we focus on markets where technology, innovation, and
        capital can unlock long-term value and drive economic growth.
      </p>
    </div>
  );
};

export default Banner;

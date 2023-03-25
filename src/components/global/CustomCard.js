import { Badge, Rating } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { SiStellar } from "react-icons/si";
import { dev } from "../../config";
import MemoImage from "../ui/MemoImage";

const CustomCard = ({ asset, title, description, amount, id, rating }) => {
  const ratingArr = Array.from({ length: Math.floor(rating) });
  const isFloat = (v) => Math.floor(v) !== Math.ceil(v);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border hover:shadow-md">
      <MemoImage
        alt={title}
        src={`https://source.unsplash.com/random/?${title?.split(" ")[0]}`}
      />

      <div className="flex flex-col p-6 space-y-4 w-full">
        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {title?.split("-")[0]}
        </h5>
        <p className="text-truncate-custom  text-base font-normal text-gray-500  dark:text-gray-400">
          {description}
        </p>
        <div className="flex space-x-2 justify-start">
          <Rating>
            {ratingArr?.map((_, index) => {
              if (rating <= 5) {
                if (isFloat(rating) && index === ratingArr.length - 1) {
                  return <Rating.Star key={index} filled={false} />;
                } else return <Rating.Star key={index} />;
              }
            })}
          </Rating>
          <Badge color="info">{rating}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            <div className="flex gap-1 items-center">
              {amount} <SiStellar size="20" />
            </div>
          </span>
          <NavLink
            className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            to={`/assets/${id}`}
            state={{ asset: asset }}
          >
            View Asset
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CustomCard;

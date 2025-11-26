import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({ rating = 4 }) => {
  return (
    <div aria-label={`Rating: ${rating} out of 5`} className="flex">
      {Array.from({ length: 5 }).map((_, index) => (
        <img
          key={index}
          src={rating > index ? assets.starIconFilled : assets.starIconOutlined}
          alt=""
          aria-hidden="true"
          className="w-[18px] h-[18px]"  // or w-5 h-5
        />
      ))}
    </div>
  );
};

export default StarRating;

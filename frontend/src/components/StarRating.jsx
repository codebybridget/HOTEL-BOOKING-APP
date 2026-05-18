import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({ rating = 4, size = 18 }) => {
  const totalStars = 5;

  return (
    <div
      className="flex items-center"
      aria-label={`Rating: ${rating} out of ${totalStars}`}
    >
      {Array.from({ length: totalStars }).map((_, index) => {
        const isFilled = index < Math.floor(rating);

        return (
          <img
            key={index}
            src={
              isFilled
                ? assets.starIconFilled
                : assets.starIconOutlined
            }
            alt=""
            aria-hidden="true"
            style={{ width: size, height: size }}
          />
        );
      })}
    </div>
  );
};

export default StarRating;
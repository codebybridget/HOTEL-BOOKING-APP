import React from "react";
import { assets } from "../assets/assets";

const StarRating = ({
  rating = 4,
  size = 18,
  showValue = true,
}) => {
  const totalStars = 5;

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Rating: ${rating} out of ${totalStars}`}
    >
      {/* STARS */}
      <div className="flex items-center">
        {Array.from({
          length: totalStars,
        }).map((_, index) => {
          const isFilled =
            index < Math.floor(rating);

          return (
            <img
              key={index}
              src={
                isFilled
                  ? assets.starIconFilled
                  : assets.starIconOutlined
              }
              alt="star"
              aria-hidden="true"
              style={{
                width: size,
                height: size,
              }}
              className="object-contain"
            />
          );
        })}
      </div>

      {/* VALUE */}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
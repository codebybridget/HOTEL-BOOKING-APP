import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const HotelCard = ({ room, index = 0 }) => {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link
      to={`/rooms/${room?._id}`}
      onClick={handleClick}
      className="relative w-full max-w-[280px] rounded-xl overflow-hidden bg-white text-gray-600 shadow-sm hover:shadow-md transition"
    >
      {/* Image */}
      <img
        src={room?.images?.[0]}
        alt={room?.hotel?.name || "hotel room"}
        className="w-full h-44 object-cover"
      />

      {/* Badge */}
      {index % 2 === 0 && (
        <span className="absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium px-3 py-1 rounded-full">
          Best Seller
        </span>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Title + Rating */}
        <div className="flex items-center justify-between">
          <p className="font-playfair text-lg font-medium text-gray-800 truncate">
            {room?.hotel?.name}
          </p>

          <div className="flex items-center gap-1 text-sm">
            <img
              src={assets.starIconFilled}
              alt="rating"
              className="w-4 h-4"
            />
            4.5
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mt-1 text-sm">
          <img
            src={assets.locationIcon}
            alt="location"
            className="w-4 h-4"
          />
          <span className="truncate">{room?.hotel?.address}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm">
            <span className="text-lg text-gray-800 font-semibold">
              ${room?.pricePerNight}
            </span>{" "}
            /night
          </p>

          {/* Changed button to span (valid inside Link) */}
          <span className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded hover:bg-gray-100 transition">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
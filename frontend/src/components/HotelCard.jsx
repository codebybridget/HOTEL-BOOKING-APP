import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const HotelCard = ({ room, index = 0 }) => {
  const { currency } = useAppContext();

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Link
      to={`/rooms/${room?._id}`}
      onClick={handleClick}
      className="relative w-full rounded-2xl overflow-hidden bg-white text-gray-600 shadow-sm hover:shadow-xl transition duration-300"
    >
      {/* IMAGE */}
      <div className="overflow-hidden">
        <img
          src={
            room?.images?.[0] ||
            assets.roomImg
          }
          alt={
            room?.hotel?.name ||
            "Hotel room"
          }
          className="w-full h-56 object-cover hover:scale-105 transition duration-500"
        />
      </div>

      {/* BADGE */}
      {index % 2 === 0 && (
        <span className="absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium px-3 py-1 rounded-full shadow">
          Best Seller
        </span>
      )}

      {/* CONTENT */}
      <div className="p-4">
        {/* HOTEL NAME + RATING */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-playfair text-lg font-semibold text-gray-800 line-clamp-1">
              {room?.hotel?.name ||
                "Luxury Hotel"}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {room?.roomType ||
                "Standard Room"}
            </p>
          </div>

          <div className="flex items-center gap-1 text-sm bg-yellow-50 px-2 py-1 rounded">
            <img
              src={
                assets.starIconFilled
              }
              alt="rating"
              className="w-4 h-4"
            />

            <span className="font-medium text-gray-700">
              4.5
            </span>
          </div>
        </div>

        {/* LOCATION */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <img
            src={
              assets.locationIcon
            }
            alt="location"
            className="w-4 h-4"
          />

          <span className="truncate">
            {room?.hotel?.address ||
              "Nigeria"}
          </span>
        </div>

        {/* AMENITIES */}
        {room?.amenities?.length >
          0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {room.amenities
              .slice(0, 3)
              .map((item, i) => (
                <span
                  key={i}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                >
                  {item}
                </span>
              ))}
          </div>
        )}

        {/* PRICE + CTA */}
        <div className="flex items-center justify-between mt-5">
          <p className="text-sm text-gray-500">
            <span className="text-2xl text-gray-800 font-bold">
              {currency}
              {Number(
                room?.pricePerNight ||
                  0
              ).toLocaleString()}
            </span>{" "}
            / night
          </p>

          <span className="px-4 py-2 text-xs font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Book Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
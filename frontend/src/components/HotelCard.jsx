import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const HotelCard = ({ room }) => {
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
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={
            room?.images?.[0] ||
            assets.roomImg
          }
          alt={
            room?.hotel?.name ||
            "Hotel"
          }
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />

        {/* DISCOUNT */}
        <div className="absolute top-4 left-0 bg-[#00ADEF] text-white px-5 py-2 text-sm font-bold shadow-lg rounded-r-full">
          Best Deal
        </div>

        {/* RATING */}
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1 shadow">
          <img
            src={assets.starIconFilled}
            alt="rating"
            className="w-4 h-4"
          />

          <span className="font-semibold text-sm">
            4.8
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-6">
        {/* HOTEL NAME */}
        <h3 className="text-2xl font-bold text-gray-800 line-clamp-1">
          {room?.hotel?.name ||
            "Luxury Hotel"}
        </h3>

        {/* ROOM TYPE */}
        <p className="text-lg text-[#00ADEF] mt-2 font-medium">
          {room?.roomType ||
            "Executive Room"}
        </p>

        {/* LOCATION */}
        <div className="flex items-center gap-2 mt-4 text-gray-500">
          <img
            src={assets.locationIcon}
            alt="location"
            className="w-5 h-5"
          />

          <span className="line-clamp-1">
            {room?.hotel?.address ||
              "Nigeria"}
          </span>
        </div>

        {/* AMENITIES */}
        {room?.amenities?.length >
          0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {room.amenities
              .slice(0, 3)
              .map((item, index) => (
                <span
                  key={index}
                  className="bg-[#eef9ff] text-[#00ADEF] px-3 py-1 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
          </div>
        )}

        {/* PRICE */}
        <div className="flex items-end justify-between mt-8">
          <div>
            <p className="text-gray-500 text-sm">
              Price per night
            </p>

            <h2 className="text-3xl font-bold text-gray-800 mt-1">
              {currency}
              {Number(
                room?.pricePerNight || 99
              ).toLocaleString()}
            </h2>
          </div>

          {/* BUTTON */}
          <button className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-5 py-3 rounded-lg font-semibold transition">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
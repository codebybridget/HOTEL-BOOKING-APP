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
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition duration-300 border border-gray-100"
    >
      {/* IMAGE */}
      <div className="relative h-72 overflow-hidden">
        <img
          src={
            room?.images?.[0] ||
            room?.hotel?.images?.[0] ||
            assets.roomImg
          }
          alt={
            room?.hotel?.name ||
            "Hotel"
          }
          className="w-full h-full object-cover hover:scale-110 transition duration-700"
        />

        {/* STATUS */}
        <div className="absolute top-5 left-0 bg-[#00ADEF] text-white px-5 py-2 rounded-r-full font-semibold shadow-lg">
          Available
        </div>

        {/* RATING */}
        <div className="absolute top-5 right-5 bg-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
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
      <div className="p-7">
        {/* LOCATION */}
        <p className="text-[#00ADEF] text-sm font-semibold uppercase tracking-wide">
          {room?.hotel?.city}{" "}
          {room?.hotel?.area &&
            `• ${room?.hotel?.area}`}
        </p>

        {/* HOTEL NAME */}
        <h2 className="text-3xl font-bold text-gray-800 mt-3 line-clamp-1">
          {room?.hotel?.name ||
            "Luxury Hotel"}
        </h2>

        {/* ROOM TYPE */}
        <h3 className="text-xl text-gray-600 mt-3">
          {room?.roomType ||
            "Executive Suite"}
        </h3>

        {/* ADDRESS */}
        <div className="flex items-center gap-2 mt-5 text-gray-500">
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

        {/* PHONE */}
        <div className="flex items-center gap-2 mt-4 text-gray-500">
          <span className="text-lg">
            📞
          </span>

          <span>
            {room?.hotel?.contact ||
              "+234"}
          </span>
        </div>

        {/* AMENITIES */}
        {room?.amenities?.length >
          0 && (
          <div className="flex flex-wrap gap-3 mt-6">
            {room.amenities
              .slice(0, 4)
              .map((item, index) => (
                <span
                  key={index}
                  className="bg-[#eef9ff] text-[#00ADEF] px-4 py-2 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
          </div>
        )}

        {/* PRICE + BUTTON */}
        <div className="flex items-end justify-between mt-10">
          <div>
            <p className="text-gray-500">
              Price Per Night
            </p>

            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              {currency}
              {Number(
                room?.pricePerNight || 0
              ).toLocaleString()}
            </h2>
          </div>

          <button className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-6 py-4 rounded-xl font-semibold transition">
            View Room
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
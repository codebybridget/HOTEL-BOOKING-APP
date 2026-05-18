import React from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
  const navigate = useNavigate();

  // Prepare featured rooms (easy to replace with API later)
  const featuredRooms = roomsDummyData.slice(0, 4);

  const handleNavigate = () => {
    navigate("/rooms");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 text-black py-20">
      <div className="w-full max-w-6xl">
        <Title
          title="Featured Destination"
          subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {featuredRooms.map((room) => (
            <HotelCard key={room._id} room={room} />
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleNavigate}
            className="mt-12 px-5 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            View All Destinations
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestination;
import React from "react";
import { roomsDummyData } from "../assets/assets";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";

const FeaturedDestination = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 text-black py-20">
      <Title
        title="Featured Destination"
        subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 w-full max-w-6xl">
        {roomsDummyData.slice(0, 4).map((room) => (
          <HotelCard key={room._id} room={room} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => {
          navigate("/rooms");
          window.scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
      >
        View All Destinations
      </button>
    </div>
  );
};

export default FeaturedDestination;

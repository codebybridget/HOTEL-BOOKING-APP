import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const FeaturedDestination = () => {
  const navigate = useNavigate();

  const { axios } = useAppContext();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH FEATURED ROOMS
  // =========================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms");

        if (data?.success) {
          setRooms(data.rooms?.slice(0, 4) || []);
        } else {
          setRooms([]);
        }
      } catch (error) {
        console.error(
          "Featured rooms error:",
          error.response?.data || error.message
        );

        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [axios]);

  // =========================
  // NAVIGATE
  // =========================
  const handleNavigate = () => {
    navigate("/rooms");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 bg-slate-50 text-black py-24">
      <div className="w-full max-w-7xl">
        <Title
          title="Featured Destinations"
          subTitle="Discover carefully selected hotels and luxury rooms in top destinations across Nigeria, offering comfort, convenience, and unforgettable experiences."
        />

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center mt-12">
            <p className="text-gray-500">
              Loading featured rooms...
            </p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="flex justify-center mt-12">
            <p className="text-gray-500">
              No featured rooms available.
            </p>
          </div>
        ) : (
          <>
            {/* ROOMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {rooms.map((room) => (
                <HotelCard
                  key={room._id}
                  room={room}
                />
              ))}
            </div>

            {/* BUTTON */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNavigate}
                className="mt-12 px-6 py-2.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                View All Destinations
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestination;
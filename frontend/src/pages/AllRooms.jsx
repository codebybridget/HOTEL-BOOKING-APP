import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const AllRooms = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { axios, currency } = useAppContext();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("");

  const destination = searchParams.get("destination") || "";
  const area = searchParams.get("area") || "";

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const params = new URLSearchParams();

        if (destination) {
          params.set("destination", destination);
        }

        if (area) {
          params.set("area", area);
        }

        const { data } = await axios.get(`/api/hotels?${params.toString()}`);

        if (data?.success) {
          setHotels(data.hotels || []);
        }
      } catch (error) {
        console.error("Fetch hotels error:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [axios, destination, area]);

  const areas = useMemo(() => {
    const list = hotels.map((hotel) => hotel?.area).filter(Boolean);
    return [...new Set(list)];
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    let filtered = [...hotels];

    if (sortOption === "Price Low") {
      filtered.sort((a, b) => (a.lowestPrice || 0) - (b.lowestPrice || 0));
    }

    if (sortOption === "Price High") {
      filtered.sort((a, b) => (b.lowestPrice || 0) - (a.lowestPrice || 0));
    }

    return filtered;
  }, [hotels, sortOption]);

  const handleHotelNavigate = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAreaClick = (selectedArea) => {
    const params = new URLSearchParams();

    if (destination) {
      params.set("destination", destination.toLowerCase());
    }

    params.set("area", selectedArea.toLowerCase());

    navigate(`/rooms?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearArea = () => {
    const params = new URLSearchParams();

    if (destination) {
      params.set("destination", destination.toLowerCase());
    }

    navigate(`/rooms?${params.toString()}`);
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen pt-28 px-4 md:px-10 lg:px-20 pb-20">
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 capitalize">
          {area
            ? `Hotels in ${area}`
            : destination
            ? `Hotels in ${destination}`
            : "Hotels in Nigeria"}
        </h1>

        <p className="text-gray-500 text-lg mt-3">
          {filteredHotels.length} hotels available
        </p>

        {destination && areas.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
              Areas in {destination}
            </h2>

            <div className="flex flex-wrap gap-3">
              {area && (
                <button
                  type="button"
                  onClick={clearArea}
                  className="bg-gray-100 border px-5 py-3 rounded-lg font-medium hover:border-[#00ADEF]"
                >
                  All Areas
                </button>
              )}

              {areas.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleAreaClick(item)}
                  className={`px-5 py-3 rounded-lg font-medium capitalize border ${
                    area.toLowerCase() === item.toLowerCase()
                      ? "bg-[#00ADEF] text-white border-[#00ADEF]"
                      : "bg-white hover:border-[#00ADEF]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setSortOption("")}
            className={`px-5 py-3 rounded-lg font-medium border ${
              sortOption === ""
                ? "bg-[#00ADEF] text-white border-[#00ADEF]"
                : "bg-white hover:border-[#00ADEF]"
            }`}
          >
            Recommended
          </button>

          <button
            type="button"
            onClick={() => setSortOption("Price Low")}
            className={`border px-5 py-3 rounded-lg font-medium hover:border-[#00ADEF] ${
              sortOption === "Price Low"
                ? "bg-[#00ADEF] text-white border-[#00ADEF]"
                : "bg-white"
            }`}
          >
            Lowest Price
          </button>

          <button
            type="button"
            onClick={() => setSortOption("Price High")}
            className={`border px-5 py-3 rounded-lg font-medium hover:border-[#00ADEF] ${
              sortOption === "Price High"
                ? "bg-[#00ADEF] text-white border-[#00ADEF]"
                : "bg-white"
            }`}
          >
            Highest Price
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Loading hotels...</p>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center">
          <h2 className="text-3xl font-bold text-gray-700">No hotels found</h2>

          <p className="text-gray-500 mt-4">
            Try another state or area.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col lg:flex-row"
            >
              <div className="lg:w-[38%] relative">
                <img
                  src={hotel?.images?.[0] || assets.roomImg}
                  alt={hotel?.name || "Hotel"}
                  onClick={() => handleHotelNavigate(hotel._id)}
                  className="w-full h-80 lg:h-full object-cover cursor-pointer"
                />

                <div className="absolute top-5 left-0 bg-[#00ADEF] text-white px-5 py-2 rounded-r-full font-semibold shadow-lg">
                  {hotel.roomsCount || 0} Rooms
                </div>
              </div>

              <div className="lg:w-[62%] p-8 flex flex-col justify-between">
                <div>
                  <p className="text-[#00ADEF] text-lg font-medium capitalize">
                    {hotel?.city} {hotel?.area && `• ${hotel.area}`}
                  </p>

                  <h2
                    onClick={() => handleHotelNavigate(hotel._id)}
                    className="text-4xl font-bold text-gray-800 mt-2 cursor-pointer hover:text-[#00ADEF]"
                  >
                    {hotel?.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-5 text-gray-500">
                    <img
                      src={assets.locationIcon}
                      alt="location"
                      className="w-5 h-5"
                    />

                    <span className="text-lg">{hotel?.address}</span>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mt-6">
                    View this hotel to see all available rooms, room pictures,
                    prices, amenities, and booking options.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-10">
                  <div>
                    <p className="text-gray-500">Rooms starting from</p>

                    <h2 className="text-5xl font-bold text-gray-800 mt-2">
                      {currency}
                      {Number(hotel?.lowestPrice || 0).toLocaleString()}
                    </h2>

                    <p className="text-gray-500 mt-1">per night</p>
                  </div>

                  <button
                    onClick={() => handleHotelNavigate(hotel._id)}
                    className="bg-[#00ADEF] hover:bg-[#0095cc] text-white px-8 py-4 rounded-xl text-lg font-semibold transition"
                  >
                    View Rooms
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllRooms;